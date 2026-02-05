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
      
      // Get DeepBook client with user's address
      const deepBookClient = suiService.getDeepBookClient(walletAddress);
      
      // Verify client structure
      console.log(`[DeepBookService] DeepBookClient type:`, typeof deepBookClient);
      console.log(`[DeepBookService] DeepBookClient keys:`, Object.keys(deepBookClient));
      console.log(`[DeepBookService] Has deepBook property:`, 'deepBook' in deepBookClient);
      
      if ('deepBook' in deepBookClient) {
        const deepBook = (deepBookClient as any).deepBook;
        console.log(`[DeepBookService] deepBook keys:`, Object.keys(deepBook));
        console.log(`[DeepBookService] deepBook.swapExactBaseForQuote type:`, typeof deepBook.swapExactBaseForQuote);
        
        if (typeof deepBook.swapExactBaseForQuote === 'function') {
          console.log(`[DeepBookService] ✓ swapExactBaseForQuote is a function!`);
        }
      }
      
      // Create transaction
      const tx = new Transaction();
      tx.setSender(walletAddress);
      
      // Set gas budget (important: reserve SUI for gas fees)
      tx.setGasBudget(50000000); // 0.05 SUI for gas

      // Determine swap direction (base to quote or quote to base)
      const isBaseToQuote = tokenIn === "SUI"; // SUI is base, DBUSDC is quote
      
      console.log(`[DeepBookService] Building swap transaction`);
      console.log(`[DeepBookService] Pool: ${pool.poolName}`);
      console.log(`[DeepBookService] Direction: ${isBaseToQuote ? 'base->quote (SUI->DBUSDC)' : 'quote->base (DBUSDC->SUI)'}`);
      console.log(`[DeepBookService] Amount: ${amountIn}, Min out: ${minAmountOut}`);
      
      // Get user's coins for the input token
      const coins = await suiService.getClient().getCoins({
        owner: walletAddress,
        coinType: tokenInConfig.coinType,
      });

      if (!coins.data || coins.data.length === 0) {
        throw new ApiError(400, `No ${tokenIn} coins found in wallet`, ErrorCodes.INVALID_AMOUNT);
      }

      console.log(`[DeepBookService] Found ${coins.data.length} ${tokenIn} coin objects`);

      // Prepare baseCoin explicitly (SDK docs: "Passing baseCoin ensures the swap uses a real SUI coin")
      const amountInRaw = toRawAmount(amountIn, tokenInConfig.decimals);
      console.log(`[DeepBookService] Amount in raw: ${amountInRaw}`);
      
      const totalBalance = coins.data.reduce((sum, c) => sum + BigInt(c.balance), 0n);
      console.log(`[DeepBookService] Total balance: ${totalBalance}`);
      
      if (totalBalance < amountInRaw) {
        throw new ApiError(400, `Insufficient ${tokenIn} balance`, ErrorCodes.INVALID_AMOUNT);
      }

      // SDK will auto-select coins from address (baseCoin/quoteCoin/deepCoin optional)
      console.log(`[DeepBookService] Letting SDK auto-select coins for swap`);

      // Use DeepBook SDK swap helper - no BalanceManager required
      try {
        console.log(`[DeepBookService] Using deepBookClient.deepBook.swapExactBaseForQuote...`);
        console.log(`[DeepBookService] Swap params:`, {
          poolKey: pool.poolName,
          amountIn: amountIn,
          amountInFloat: parseFloat(amountIn),
          minAmountOut: minAmountOut,
          minAmountOutFloat: parseFloat(minAmountOut),
        });
        
        // Swap exact base for quote (SUI → DBUSDC)
        // SDK docs: "Passing baseCoin ensures the swap uses a real SUI coin"
        // Pass BOTH amount (how much to swap) and baseCoin (which coin to use)
        console.log(`[DeepBookService] Calling swapExactBaseForQuote with amount=${amountIn}...`);
        
        // Convert minOut to raw units for the SDK
        const tokenOutConfig = getTokenConfig(tokenOut as TokenSymbol);
        console.log(`[DeepBookService] Token out: ${tokenOut}, decimals: ${tokenOutConfig.decimals}`);
        console.log(`[DeepBookService] minAmountOut input: ${minAmountOut} (type: ${typeof minAmountOut})`);
        
        const minOutRaw = toRawAmount(minAmountOut, tokenOutConfig.decimals);
        console.log(`[DeepBookService] minOutRaw after conversion: ${minOutRaw.toString()}`);
        
        console.log(`[DeepBookService] Swap parameters:`, {
          poolKey: pool.poolName,
          amount: parseFloat(amountIn),
          deepAmount: 0,
          minOut: parseFloat(minAmountOut),
          minOutRaw: minOutRaw.toString(),
          minOutRawInt: parseInt(minOutRaw.toString()),
          amountType: typeof parseFloat(amountIn),
          minOutType: typeof parseFloat(minAmountOut),
        });
        
        const swapResult = (deepBookClient as any).deepBook.swapExactBaseForQuote({
          poolKey: pool.poolName,
          amount: parseFloat(amountIn),  // How much to swap (0.2 SUI)
          deepAmount: 0,
          minOut: parseInt(minOutRaw.toString()), // Raw units: 209484 (6 decimals)
          // baseCoin: NOT passing - let SDK auto-select from address
        })(tx);
        
        console.log(`[DeepBookService] Swap result type:`, typeof swapResult);
        
        // The result should be [baseOut, quoteOut, deepOut]
        const [baseOut, quoteOut, deepOut] = Array.isArray(swapResult) ? swapResult : [null, swapResult, null];
        
        console.log(`[DeepBookService] Swap outputs created:`, {
          baseOut: typeof baseOut,
          quoteOut: typeof quoteOut,
          deepOut: typeof deepOut,
        });
        console.log(`[DeepBookService] Transferring outputs to wallet:`, walletAddress);
        
        // Transfer ALL outputs to the user's wallet (required to avoid UnusedValueWithoutDrop error)
        // baseOut: leftover base coin (if any)
        // quoteOut: the quote coin we receive (DBUSDC)
        // deepOut: DEEP token rewards (if any)
        tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
        
        console.log(`[DeepBookService] Swap transaction built successfully`);
        
        // Log transaction details for debugging
        console.log(`[DeepBookService] Transaction block data:`, JSON.stringify(tx.blockData, null, 2));
      } catch (swapError: any) {
        console.error(`[DeepBookService] Failed to build swap:`, swapError);
        throw new ApiError(500, `Failed to build swap transaction: ${swapError.message}`, ErrorCodes.INTERNAL_ERROR);
      }
      
      // Build transaction bytes
      console.log(`[DeepBookService] Building transaction bytes...`);
      console.log(`[DeepBookService] Transaction data:`, JSON.stringify((tx as any).blockData, null, 2));
      
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
