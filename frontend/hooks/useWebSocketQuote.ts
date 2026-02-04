// hooks/useWebSocketQuote.ts - Real-time quote updates via WebSocket

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface WSQuote {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountInRaw: string;
  estimatedAmountOut: string;
  estimatedAmountOutRaw: string;
  pricePerToken: string;
  priceImpact: string;
  poolId: string;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";

export function useWebSocketQuote(
  tokenIn: string,
  tokenOut: string,
  amountIn: string
) {
  const [quote, setQuote] = useState<WSQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!amountIn || parseFloat(amountIn) <= 0) {
      return;
    }

    console.log("[WebSocketQuote] Connecting to", `${WS_URL}/ws/quotes`);
    
    try {
      const ws = new WebSocket(`${WS_URL}/ws/quotes`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[WebSocketQuote] Connected");
        setConnected(true);
        setError(null);

        // Subscribe to quote updates
        ws.send(JSON.stringify({
          type: "subscribe_quote",
          data: {
            tokenIn,
            tokenOut,
            amountIn,
          },
        }));

        setLoading(true);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          console.log("[WebSocketQuote] Message received:", message.type);

          if (message.type === "quote_update") {
            setQuote(message.data);
            setLoading(false);
            setError(null);
          } else if (message.type === "quote_error") {
            setError(message.error);
            setLoading(false);
          }
        } catch (err) {
          console.error("[WebSocketQuote] Error parsing message:", err);
        }
      };

      ws.onerror = (event) => {
        console.error("[WebSocketQuote] Error:", event);
        setError("WebSocket connection error");
        setLoading(false);
      };

      ws.onclose = () => {
        console.log("[WebSocketQuote] Disconnected");
        setConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("[WebSocketQuote] Attempting to reconnect...");
          connect();
        }, 3000);
      };
    } catch (err) {
      console.error("[WebSocketQuote] Connection error:", err);
      setError("Failed to connect to WebSocket");
    }
  }, [tokenIn, tokenOut, amountIn]);

  const disconnect = useCallback(() => {
    console.log("[WebSocketQuote] Disconnecting");
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setConnected(false);
    setQuote(null);
    setLoading(false);
  }, []);

  // Connect when parameters change
  useEffect(() => {
    if (amountIn && parseFloat(amountIn) > 0) {
      disconnect(); // Close existing connection
      connect();
    } else {
      disconnect();
      setQuote(null);
    }

    return () => {
      disconnect();
    };
  }, [tokenIn, tokenOut, amountIn]);

  return {
    quote,
    loading,
    error,
    connected,
    reconnect: connect,
  };
}
