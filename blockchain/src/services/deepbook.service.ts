import { Transaction } from "@mysten/sui/client";
import { suiService } from "./sui.service.js";
import { poolService } from "./pool.service.js";
import { TOKENS, TokenSymbol, isValidToken, getTokenConfig } from "../config/tokens.js";
import { toRawAmount, fromRawAmount, calculatePriceImpact } from "../utils/format.js";
import { ApiError, ErrorCodes } from "../utils/errors.js";
import { QuoteRequest, QuoteResponse, SwapBuildRequest, SwapBuildResponse } from "../types/index.js";

// Mock exchange rates for testnet (DeepBook may have limited liquidity)
const MOCK_RATES: Record<string, number> = {
  "SUI_USDC": 2.45,    // 1 SUI = 2.45 USDC
  "USDC_SUI": 0.408,   // 1 USDC = 0.408 SUI
};

export class DeepBookService {
  /**
   * Get price quote for a swap
   */
  async getQuote(params: QuoteRequest): Promise<QuoteResponse> {
    const { tokenIn, tokenOut, amountIn } = params;

    console.log(`[DeepBookService] getQuote: ${amountIn} ${tokenIn} -> ${tokenOut}`);

    // Validate tokens
    if (!isValidToken(tokenIn) || !isValidToken(tokenOut)) {
      console.error(`[DeepBookService] Invalid token: ${tokenIn} or ${tokenOut}`);
      throw new ApiError(400, "Invalid token symbol", ErrorCodes.INVALID_TOKEN);
    }

    // Get token configs
    const tokenInConfig = getTokenConfig(tokenIn as TokenSymbol);
    const tokenOutConfig = getTokenConfig(tokenOut as TokenSymbol);

    // Convert to raw amount
    const amountInRaw = toRawAmount(amountIn, tokenInConfig.decimals);
    console.log(`[DeepBookService] Amount in raw: ${amountInRaw}`);

    // Get exchange rate (mock for testnet)
    const rateKey = `${tokenIn}_${tokenOut}`;
    const rate = MOCK_RATES[rateKey];

    if (!rate) {
      console.error(`[DeepBookService] No rate for pair: ${rateKey}`);
      throw new ApiError(400, `Trading pair not supported: ${tokenIn}/${tokenOut}`, ErrorCodes.INVALID_TOKEN);
    }

    // Calculate output amount
    const amountInFloat = parseFloat(amountIn);
    const estimatedOut = amountInFloat * rate;
    const estimatedAmountOutRaw = toRawAmount(estimatedOut.toFixed(tokenOutConfig.decimals), tokenOutConfig.decimals);
    
    const estimatedAmountOut = fromRawAmount(BigInt(estimatedAmountOutRaw), tokenOutConfig.decimals);
    const pricePerToken = rate.toFixed(6);
    
    // Apply 1% slippage for min amount
    const minOut = estimatedOut * 0.99;
    const minAmountOutRaw = toRawAmount(minOut.toFixed(tokenOutConfig.decimals), tokenOutConfig.decimals);

    console.log(`[DeepBookService] Quote: ${estimatedAmountOut} ${tokenOut} (rate: ${rate})`);

    return {
      tokenIn,
      tokenOut,
      amountIn,
      amountInRaw: amountInRaw.toString(),
      estimatedAmountOut,
      estimatedAmountOutRaw: estimatedAmountOutRaw.toString(),
      pricePerToken,
      priceImpact,
      poolId: pool.poolId,
    };
  }

  /**
   * Build swap transaction (unsigned)
   */
  async buildSwapTransaction(params: SwapBuildRequest): Promise<SwapBuildResponse> {
    const { walletAddress, tokenIn, tokenOut, amountIn, minAmountOut } = params;

    // Validate tokens
    if (!isValidToken(tokenIn) || !isValidToken(tokenOut)) {
      throw new ApiError(400, "Invalid token symbol", ErrorCodes.INVALID_TOKEN);
    }

    // Get token configs
    const tokenInConfig = getTokenConfig(tokenIn as TokenSymbol);
    const tokenOutConfig = getTokenConfig(tokenOut as TokenSymbol);

    // Get pool
    const pool = await poolService.getPoolByPair(tokenIn, tokenOut);

    // Convert amounts to raw
    const amountInRaw = toRawAmount(amountIn, tokenInConfig.decimals);
    const minAmountOutRaw = toRawAmount(minAmountOut, tokenOutConfig.decimals);

    // Get quote for display
    const quote = await this.getQuote({ tokenIn, tokenOut, amountIn });

    try {
      // Build transaction
      console.log(`[DeepBookService] Building swap transaction for ${walletAddress}`);
      const tx = new Transaction();
      tx.setSender(walletAddress);

      // For demo: Build a self-transfer to test signing flow
      // In production: This would call DeepBook swap functions
      if (tokenIn === "SUI") {
        console.log(`[DeepBookService] Building SUI transfer (demo mode)`);
        // Get user's SUI coins
        const coins = await suiService.getClient().getCoins({
          owner: walletAddress,
          coinType: tokenInConfig.coinType,
        });

        if (!coins.data || coins.data.length === 0) {
          throw new ApiError(400, "No SUI coins found in wallet", ErrorCodes.INVALID_AMOUNT);
        }

        // Demo: self-transfer
        const [coin] = tx.splitCoins(tx.gas, [amountInRaw]);
        tx.transferObjects([coin], walletAddress);
      } else {
        console.log(`[DeepBookService] Building ${tokenIn} transfer (demo mode)`);
        // For USDC -> SUI or other pairs
        const coins = await suiService.getClient().getCoins({
          owner: walletAddress,
          coinType: tokenInConfig.coinType,
        });

        if (!coins.data || coins.data.length === 0) {
          throw new ApiError(400, `No ${tokenIn} coins found in wallet`, ErrorCodes.INVALID_AMOUNT);
        }

        // Demo: self-transfer
        tx.transferObjects([tx.object(coins.data[0].coinObjectId)], walletAddress);
      }

      // Build transaction bytes
      const txBytes = await tx.build({ client: suiService.getClient() });
      const txBytesBase64 = Buffer.from(txBytes).toString("base64");
      
      console.log(`[DeepBookService] Transaction built, bytes length: ${txBytes.length}`);
      console.log(`[DeepBookService] Transaction built, bytes length: ${txBytes.length}`);

      return {
        transaction: {
          txBytes: txBytesBase64,
          estimatedGas: "5000000",
        },
        quote: {
          amountIn,
          estimatedAmountOut: quote.estimatedAmountOut,
          minAmountOut,
          priceImpact: quote.priceImpact,
        },
        poolId: pool.poolId,
      };
    } catch (error: any) {
      console.error("[DeepBookService] Error building swap transaction:", error);
      throw new ApiError(
        500,
        error.message || "Failed to build swap transaction",
        ErrorCodes.TRANSACTION_BUILD_FAILED
      );
    }
  }
}

export const deepBookService = new DeepBookService();
