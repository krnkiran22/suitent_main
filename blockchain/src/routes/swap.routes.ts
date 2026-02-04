import { Router, Request, Response } from "express";
import { deepBookService } from "../services/deepbook.service";
import { suiService } from "../services/sui.service";
import { SwapBuildRequest } from "../types";

const router = Router();

/**
 * POST /api/swap/build
 * Build unsigned swap transaction
 */
router.post("/build", async (req: Request, res: Response) => {
  try {
    const { walletAddress, tokenIn, tokenOut, amountIn, minAmountOut } = req.body as SwapBuildRequest;

    // Validate required fields
    if (!walletAddress || !tokenIn || !tokenOut || !amountIn || !minAmountOut) {
      return res.status(400).json({
        error: {
          message: "Missing required fields: walletAddress, tokenIn, tokenOut, amountIn, minAmountOut",
          code: "INVALID_REQUEST",
        },
      });
    }

    // Validate wallet address format
    if (!walletAddress.startsWith("0x") || walletAddress.length !== 66) {
      return res.status(400).json({
        error: {
          message: "Invalid wallet address format",
          code: "INVALID_WALLET_ADDRESS",
        },
      });
    }

    const result = await deepBookService.buildSwapTransaction({
      walletAddress,
      tokenIn: tokenIn.toUpperCase(),
      tokenOut: tokenOut.toUpperCase(),
      amountIn,
      minAmountOut,
    });

    res.json(result);
  } catch (error) {
    throw error;
  }
});

/**
 * GET /api/swap/balances/:walletAddress
 * Get token balances for a wallet
 */
router.get("/balances/:walletAddress", async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress.startsWith("0x") || walletAddress.length !== 66) {
      return res.status(400).json({
        error: {
          message: "Invalid wallet address format",
          code: "INVALID_WALLET_ADDRESS",
        },
      });
    }

    const balances = await suiService.getAllBalances(walletAddress);

    res.json({ balances });
  } catch (error) {
    throw error;
  }
});

/**
 * GET /api/swap/transaction/:txDigest
 * Get transaction status
 */
router.get("/transaction/:txDigest", async (req: Request, res: Response) => {
  try {
    const { txDigest } = req.params;

    const tx = await suiService.getTransactionStatus(txDigest);

    res.json({
      digest: tx.digest,
      status: tx.effects?.status?.status || "unknown",
      timestamp: tx.timestampMs,
      gasUsed: tx.effects?.gasUsed,
      effects: tx.effects,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
