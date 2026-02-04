import { Router, Request, Response } from "express";
import { deepBookService } from "../services/deepbook.service.js";
import { QuoteRequest } from "../types/index.js";

const router = Router();

/**
 * POST /api/price/quote
 * Get price quote for a swap
 */
router.post("/quote", async (req: Request, res: Response) => {
  try {
    const { tokenIn, tokenOut, amountIn } = req.body as QuoteRequest;

    if (!tokenIn || !tokenOut || !amountIn) {
      return res.status(400).json({
        error: {
          message: "Missing required fields: tokenIn, tokenOut, amountIn",
          code: "INVALID_REQUEST",
        },
      });
    }

    const quote = await deepBookService.getQuote({
      tokenIn: tokenIn.toUpperCase(),
      tokenOut: tokenOut.toUpperCase(),
      amountIn,
    });

    res.json(quote);
  } catch (error) {
    throw error;
  }
});

export default router;
