import express from "express";
import cors from "cors";
import { createServer } from "http";
import { config, validateConfig } from "./config/index.js";
import routes from "./routes/index.js";
import { errorHandler } from "./utils/errors.js";
import { websocketService } from "./services/websocket.service.js";

// Validate configuration
validateConfig();

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Mount API routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "SuiTent Backend",
    version: "1.0.0",
    network: config.suiNetwork,
    endpoints: {
      health: "/api/health",
      pools: "/api/pools",
      quote: "/api/price/quote",
      buildSwap: "/api/swap/build",
      balances: "/api/swap/balances/:walletAddress",
      transaction: "/api/swap/transaction/:txDigest",
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket server
websocketService.initialize(server);

// Start server
server.listen(config.port, () => {
  console.log("🚀 SuiTent Backend Server Started");
  console.log(`   Port: ${config.port}`);
  console.log(`   Network: ${config.suiNetwork}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   Frontend: ${config.frontendUrl}`);
  console.log("");
  console.log("📡 Available endpoints:");
  console.log(`   GET  http://localhost:${config.port}/api/health`);
  console.log(`   GET  http://localhost:${config.port}/api/pools`);
  console.log(`   POST http://localhost:${config.port}/api/price/quote`);
  console.log(`   POST http://localhost:${config.port}/api/swap/build`);
  console.log(`   WS   ws://localhost:${config.port}/ws/quotes`);
  console.log("");
});
