import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { deepBookService } from "./deepbook.service.js";

interface QuoteSubscription {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  ws: WebSocket;
  intervalId?: NodeJS.Timeout;
}

export class WebSocketService {
  private wss: WebSocketServer | null = null;
  private subscriptions: Map<string, QuoteSubscription> = new Map();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ server, path: "/ws/quotes" });

    console.log("📡 WebSocket server initialized on /ws/quotes");

    this.wss.on("connection", (ws: WebSocket) => {
      console.log("[WebSocket] Client connected");

      ws.on("message", (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error("[WebSocket] Error parsing message:", error);
          ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
      });

      ws.on("close", () => {
        console.log("[WebSocket] Client disconnected");
        this.cleanupSubscriptions(ws);
      });

      ws.on("error", (error) => {
        console.error("[WebSocket] Error:", error);
      });
    });
  }

  private async handleMessage(ws: WebSocket, message: any) {
    const { type, data } = message;

    switch (type) {
      case "subscribe_quote":
        await this.subscribeQuote(ws, data);
        break;

      case "unsubscribe_quote":
        this.unsubscribeQuote(ws);
        break;

      default:
        ws.send(JSON.stringify({ error: "Unknown message type" }));
    }
  }

  private async subscribeQuote(ws: WebSocket, data: any) {
    const { tokenIn, tokenOut, amountIn } = data;

    if (!tokenIn || !tokenOut || !amountIn) {
      ws.send(JSON.stringify({ error: "Missing required fields" }));
      return;
    }

    console.log(`[WebSocket] Subscribing to quote: ${amountIn} ${tokenIn} -> ${tokenOut}`);

    // Clean up existing subscription for this WebSocket
    this.cleanupSubscriptions(ws);

    const subscriptionId = `${tokenIn}_${tokenOut}_${amountIn}_${Date.now()}`;

    // Send initial quote immediately
    await this.sendQuote(ws, tokenIn, tokenOut, amountIn);

    // Stream updates every 2 seconds
    const intervalId = setInterval(async () => {
      if (ws.readyState === WebSocket.OPEN) {
        await this.sendQuote(ws, tokenIn, tokenOut, amountIn);
      } else {
        this.cleanupSubscriptions(ws);
      }
    }, 2000); // Update every 2 seconds

    this.subscriptions.set(subscriptionId, {
      tokenIn,
      tokenOut,
      amountIn,
      ws,
      intervalId,
    });
  }

  private async sendQuote(ws: WebSocket, tokenIn: string, tokenOut: string, amountIn: string) {
    try {
      const quote = await deepBookService.getQuote({ tokenIn, tokenOut, amountIn });
      
      ws.send(JSON.stringify({
        type: "quote_update",
        data: quote,
        timestamp: Date.now(),
      }));
    } catch (error: any) {
      console.error("[WebSocket] Error fetching quote:", error);
      ws.send(JSON.stringify({
        type: "quote_error",
        error: error.message,
        timestamp: Date.now(),
      }));
    }
  }

  private unsubscribeQuote(ws: WebSocket) {
    console.log("[WebSocket] Unsubscribing from quotes");
    this.cleanupSubscriptions(ws);
    ws.send(JSON.stringify({ type: "unsubscribed", timestamp: Date.now() }));
  }

  private cleanupSubscriptions(ws: WebSocket) {
    for (const [id, sub] of this.subscriptions.entries()) {
      if (sub.ws === ws) {
        if (sub.intervalId) {
          clearInterval(sub.intervalId);
        }
        this.subscriptions.delete(id);
      }
    }
  }

  close() {
    if (this.wss) {
      this.wss.close();
    }
  }
}

export const websocketService = new WebSocketService();
