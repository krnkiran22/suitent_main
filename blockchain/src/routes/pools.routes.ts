import { Router, Request, Response } from "express";
import { poolService } from "../services/pool.service";

const router = Router();

/**
 * GET /api/pools
 * Get all available trading pools
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const pools = await poolService.fetchPools();
    res.json({ pools });
  } catch (error) {
    throw error;
  }
});

/**
 * GET /api/pools/:baseCoin/:quoteCoin
 * Get specific pool by trading pair
 */
router.get("/:baseCoin/:quoteCoin", async (req: Request, res: Response) => {
  try {
    const { baseCoin, quoteCoin } = req.params;
    const pool = await poolService.getPoolByPair(
      baseCoin.toUpperCase(),
      quoteCoin.toUpperCase()
    );
    res.json({ pool });
  } catch (error) {
    throw error;
  }
});

export default router;
