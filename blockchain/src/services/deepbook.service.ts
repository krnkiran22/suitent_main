import { Transaction } from "@mysten/sui/transactions";
import { suiService } from "./sui.service";
import { poolService } from "./pool.service";
import { TOKENS, TokenSymbol, isValidToken, getTokenConfig } from "../config/tokens";
import { toRawAmount, fromRawAmount, calculatePriceImpact } from "../utils/format";
import { ApiError, ErrorCodes } from "../utils/errors";
import { QuoteRequest, QuoteResponse, SwapBuildRequest, SwapBuildResponse } from "../types";

export class DeepBookService {
  /**
   * Get price quote for a swap
   */
  async getQuote(params: QuoteRequest): Promise<QuoteResponse> {
    const { tokenIn, tokenOut, amountIn } = params;

    // Validate tokens
    if (!isValidToken(tokenIn) || !isValidToken(tokenOut)) {
      throw new ApiError(400, "Invalid token symbol", ErrorCodes.INVALID_TOKEN);
    }

    // Get token configs
    const tokenInConfig = getTokenConfig(tokenIn as TokenSymbol);
    const tokenOutConfig = getTokenConfig(tokenOut as TokenSymbol);

    // Convert to raw amount
    const amountInRaw = toRawAmount(amountIn, tokenInConfig.decimals);

    // Get pool for this pair
    const pool = await poolService.getPoolByPair(tokenIn, tokenOut);

    // TODO: Query actual orderbook depth from DeepBook
    // For MVP, using simplified estimation
    // In production, call DeepBook indexer for actual price
    
    // Simplified price calculation (replace with actual DeepBook query)
    const mockPriceRatio = tokenIn === "USDC" && tokenOut === "SUI" ? 2.42 : 0.41;
    const estimatedAmountOutRaw = BigInt(Math.floor(Number(amountInRaw) * mockPriceRatio));
    
    const estimatedAmountOut = fromRawAmount(estimatedAmountOutRaw, tokenOutConfig.decimals);
    const pricePerToken = (Number(amountIn) / Number(estimatedAmountOut)).toFixed(6);
    const priceImpact = calculatePriceImpact(
      amountInRaw,
      estimatedAmountOutRaw,
      tokenInConfig.decimals,
      tokenOutConfig.decimals
    );

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
      const tx = new Transaction();
      tx.setSender(walletAddress);

      // TODO: Integrate actual DeepBook V3 SDK swap methods
      // For MVP, building a basic PTB structure
      // In production, use DeepBookClient from @mysten/deepbook-v3
      
      // Placeholder: Add actual swap call to DeepBook V3 contract
      // The exact method depends on whether we're swapping base->quote or quote->base
      
      // Example structure (replace with actual DeepBook V3 calls):
      // if (tokenIn === pool.baseCoin) {
      //   // Swap base (e.g., SUI) for quote (e.g., USDC)
      //   tx.moveCall({
      //     target: `${DEEPBOOK_PACKAGE}::pool::swap_exact_base_for_quote`,
      //     arguments: [
      //       tx.object(pool.poolId),
      //       tx.pure(amountInRaw.toString()),
      //       tx.pure(minAmountOutRaw.toString()),
      //     ],
      //     typeArguments: [tokenInConfig.coinType, tokenOutConfig.coinType],
      //   });
      // }

      // Set gas budget
      tx.setGasBudget(BigInt(5_000_000));

      // Get gas price
      const gasPrice = await suiService.getReferenceGasPrice();
      tx.setGasPrice(BigInt(gasPrice));

      // Build transaction bytes
      const txBytes = await tx.build({ client: suiService.getClient() });
      const txBytesBase64 = Buffer.from(txBytes).toString("base64");

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
    } catch (error) {
      console.error("❌ Error building swap transaction:", error);
      throw new ApiError(
        500,
        "Failed to build swap transaction",
        ErrorCodes.TRANSACTION_BUILD_FAILED
      );
    }
  }
}

export const deepBookService = new DeepBookService();
