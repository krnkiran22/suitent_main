import { Router } from "express";
import poolsRoutes from "./pools.routes.js";
import priceRoutes from "./price.routes.js";
import swapRoutes from "./swap.routes.js";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    network: process.env.SUI_NETWORK || "testnet",
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use("/pools", poolsRoutes);
router.use("/price", priceRoutes);
router.use("/swap", swapRoutes);

export default router;
