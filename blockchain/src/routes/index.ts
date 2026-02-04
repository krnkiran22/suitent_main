import { Router } from "express";
import poolsRoutes from "./pools.routes";
import priceRoutes from "./price.routes";
import swapRoutes from "./swap.routes";

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
