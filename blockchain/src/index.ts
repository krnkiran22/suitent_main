import express from "express";
import cors from "cors";
import { config, validateConfig } from "./config";
import routes from "./routes";
import { errorHandler } from "./utils/errors";

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

// Start server
app.listen(config.port, () => {
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
  console.log("");
});
