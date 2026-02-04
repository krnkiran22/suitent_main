import { Transaction } from "@mysten/sui/transactions";
import { suiService } from "./sui.service.js";
import { poolService } from "./pool.service.js";
import { config } from "../config/index.js";
import { TOKENS, TokenSymbol, isValidToken, getTokenConfig } from "../config/tokens.js";
import { toRawAmount, fromRawAmount, calculatePriceImpact } from "../utils/format.js";
import { ApiError, ErrorCodes } from "../utils/errors.js";
import { QuoteRequest, QuoteResponse, SwapBuildRequest, SwapBuildResponse } from "../types/index.js";

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

    // Get pool for this pair
    const pool = await poolService.getPoolByPair(tokenIn, tokenOut);
    console.log(`[DeepBookService] Using pool: ${pool.poolName} (${pool.poolId})`);

    // Get DeepBook extended client
    const deepBook = suiService.getDeepBookClient();
    
    // Determine if we're swapping base->quote or quote->base
    const isBaseToQuote = tokenIn === "SUI"; // SUI is base, DBUSDC is quote
    
    let estimatedAmountOut: string;
    let pricePerToken: string;
    let priceImpact: string;
    
    const amountInFloat = parseFloat(amountIn);
    
    console.log(`[DeepBookService] Fetching real orderbook from DeepBook indexer...`);
    
    // Fetch orderbook data from DeepBook indexer
    const orderbookUrl = `${config.deepbookIndexerUrl}/orderbook/${pool.poolName}?level=2&depth=5`;
    console.log(`[DeepBookService] Fetching: ${orderbookUrl}`);
    
    const response = await fetch(orderbookUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DeepBookService] Indexer error (${response.status}):`, errorText);
      throw new ApiError(503, `Failed to fetch orderbook from DeepBook indexer: ${response.status}`, ErrorCodes.NETWORK_ERROR);
    }
    
    const orderbook = await response.json();
    console.log(`[DeepBookService] Orderbook data:`, JSON.stringify(orderbook, null, 2));
    
    // Calculate mid price from best bid and ask
    let currentPrice: number;
    
    if (orderbook.bids && orderbook.bids.length > 0 && orderbook.asks && orderbook.asks.length > 0) {
      // Get best bid (highest buy price) and best ask (lowest sell price)
      const bestBid = Number(orderbook.bids[0][0]); // [price, quantity]
      const bestAsk = Number(orderbook.asks[0][0]);
      currentPrice = (bestBid + bestAsk) / 2; // Mid price
      
      console.log(`[DeepBookService] Best bid: ${bestBid}, Best ask: ${bestAsk}, Mid: ${currentPrice}`);
    } else {
      throw new ApiError(503, `No liquidity in orderbook for ${pool.poolName}`, ErrorCodes.POOL_NOT_FOUND);
    }
    
    console.log(`[DeepBookService] Current market price: ${currentPrice} ${tokenOut}/${tokenIn}`);
    
    if (isBaseToQuote) {
      // Selling base (SUI) for quote (DBUSDC)
      const estimatedOut = amountInFloat * currentPrice;
      estimatedAmountOut = estimatedOut.toFixed(tokenOutConfig.decimals);
      pricePerToken = currentPrice.toFixed(6);
      priceImpact = this.calculatePriceImpactPercent(amountInFloat, currentPrice, isBaseToQuote);
    } else {
      // Selling quote (DBUSDC) for base (SUI)
      const inversePrice = 1 / currentPrice;
      const estimatedOut = amountInFloat * inversePrice;
      estimatedAmountOut = estimatedOut.toFixed(tokenOutConfig.decimals);
      pricePerToken = inversePrice.toFixed(6);
      priceImpact = this.calculatePriceImpactPercent(amountInFloat, inversePrice, isBaseToQuote);
    }
    
    console.log(`[DeepBookService] Real market quote: ${estimatedAmountOut} ${tokenOut} at ${pricePerToken}`);
    
    const estimatedAmountOutRaw = toRawAmount(estimatedAmountOut, tokenOutConfig.decimals);
    
    // Apply 1% slippage for min amount
    const minOut = parseFloat(estimatedAmountOut) * 0.99;
    const minAmountOutRaw = toRawAmount(minOut.toFixed(tokenOutConfig.decimals), tokenOutConfig.decimals);

    console.log(`[DeepBookService] Final quote: ${estimatedAmountOut} ${tokenOut} (impact: ${priceImpact}%)`);

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
      
      // Get DeepBook extended client
      const deepBook = suiService.getDeepBookClient();
      
      // Create transaction
      const tx = new Transaction();
      tx.setSender(walletAddress);

      // Determine swap direction (base to quote or quote to base)
      const isBaseToQuote = tokenIn === "SUI"; // SUI is base, DBUSDC is quote
      
      // Get user's coins for the input token
      const coins = await suiService.getClient().getCoins({
        owner: walletAddress,
        coinType: tokenInConfig.coinType,
      });

      if (!coins.data || coins.data.length === 0) {
        throw new ApiError(400, `No ${tokenIn} coins found in wallet`, ErrorCodes.INVALID_AMOUNT);
      }

      console.log(`[DeepBookService] Found ${coins.data.length} ${tokenIn} coin objects`);

      // For now, return a simple transfer transaction as placeholder
      // TODO: Implement proper DeepBook V3 swap contract calls
      // The DeepBook V3 SDK extended client methods are not yet properly documented
      console.log(`[DeepBookService] Building transaction with pool: ${pool.poolName}`);
      console.log(`[DeepBookService] Swap direction: ${isBaseToQuote ? 'base->quote' : 'quote->base'}`);
      console.log(`[DeepBookService] Amount in: ${amountIn}, Min out: ${minAmountOut}`);
      
      // Create a basic transaction structure
      // Note: This is a placeholder - proper DeepBook integration requires
      // calling the correct move functions on the DeepBook contract
      const coinToUse = coins.data[0];
      
      // Build transaction bytes
      const txBytes = await tx.build({ client: suiService.getClient() });
      const txBytesBase64 = Buffer.from(txBytes).toString("base64");
      
      console.log(`[DeepBookService] Transaction built successfully, bytes length: ${txBytes.length}`);

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

  /**
   * Calculate price impact percentage based on trade size
   */
  private calculatePriceImpactPercent(amountIn: number, rate: number, isBaseToQuote: boolean): string {
    // Simple price impact model: larger trades have higher impact
    // For testnet, use minimal impact. In production, calculate from orderbook depth
    const tradeSize = isBaseToQuote ? amountIn : amountIn / rate;
    
    if (tradeSize < 1) return "0.05";
    if (tradeSize < 10) return "0.1";
    if (tradeSize < 100) return "0.3";
    if (tradeSize < 1000) return "0.5";
    return "1.0";
  }
}

export const deepBookService = new DeepBookService();
