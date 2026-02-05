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

    // Validate tokens
    if (!isValidToken(tokenIn) || !isValidToken(tokenOut)) {
      throw new ApiError(400, "Invalid token symbol", ErrorCodes.INVALID_TOKEN);
    }

    // Get token configs
    const tokenInConfig = getTokenConfig(tokenIn as TokenSymbol);
    const tokenOutConfig = getTokenConfig(tokenOut as TokenSymbol);

    // Convert to raw amount
    const amountInRaw = toRawAmount(amountIn, tokenInConfig.decimals);

    // Get pool for this pair (may be reversed)
    const pool = await poolService.getPoolByPair(tokenIn, tokenOut);
    
    // Determine swap direction based on pool structure
    const isBaseToQuote = !pool.isReversed;
    
    let estimatedAmountOut: string;
    let pricePerToken: string;
    let priceImpact: string;
    
    const amountInFloat = parseFloat(amountIn);
    
    // Fetch orderbook data from DeepBook indexer
    const orderbookUrl = `${config.deepbookIndexerUrl}/orderbook/${pool.poolName}?level=2&depth=5`;
    
    const response = await fetch(orderbookUrl);
    
    if (!response.ok) {
      throw new ApiError(503, `Failed to fetch orderbook from DeepBook indexer: ${response.status}`, ErrorCodes.NETWORK_ERROR);
    }
    
    const orderbook = await response.json();
    
    // Calculate mid price from best bid and ask
    let currentPrice: number;
    
    if (orderbook.bids && orderbook.bids.length > 0 && orderbook.asks && orderbook.asks.length > 0) {
      const bestBid = Number(orderbook.bids[0][0]);
      const bestAsk = Number(orderbook.asks[0][0]);
      currentPrice = (bestBid + bestAsk) / 2;
    } else {
      throw new ApiError(503, `No liquidity in orderbook for ${pool.poolName}`, ErrorCodes.POOL_NOT_FOUND);
    }
    
    // Price calculation based on swap direction
    if (isBaseToQuote) {
      const estimatedOut = amountInFloat * currentPrice;
      estimatedAmountOut = estimatedOut.toFixed(tokenOutConfig.decimals);
      pricePerToken = currentPrice.toFixed(6);
      priceImpact = this.calculatePriceImpactPercent(amountInFloat, currentPrice, isBaseToQuote);
    } else {
      const inversePrice = 1 / currentPrice;
      const estimatedOut = amountInFloat * inversePrice;
      estimatedAmountOut = estimatedOut.toFixed(tokenOutConfig.decimals);
      pricePerToken = inversePrice.toFixed(6);
      priceImpact = this.calculatePriceImpactPercent(amountInFloat, inversePrice, isBaseToQuote);
    }
    
    const estimatedAmountOutRaw = toRawAmount(estimatedAmountOut, tokenOutConfig.decimals);
    
    // Apply 1% slippage for min amount
    const minOut = parseFloat(estimatedAmountOut) * 0.99;
    const minAmountOutRaw = toRawAmount(minOut.toFixed(tokenOutConfig.decimals), tokenOutConfig.decimals);

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
      const gasBudget = 50000000; // 0.05 SUI for gas
      tx.setGasBudget(gasBudget);

      console.log(`[DeepBookService] Building swap transaction`);
      console.log(`[DeepBookService] Pool: ${pool.poolName}`);
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
      
      // If swapping SUI, ensure there's enough left for gas
      const gasReserve = BigInt(gasBudget); // Convert to BigInt
      const requiredTotal = tokenIn === 'SUI' ? amountInRaw + gasReserve : amountInRaw;
      
      console.log(`[DeepBookService] Required total (including gas): ${requiredTotal}, Available: ${totalBalance}`);
      
      if (totalBalance < requiredTotal) {
        throw new ApiError(
          400, 
          `Insufficient ${tokenIn} balance. Need ${requiredTotal} (${amountInRaw} for swap + ${tokenIn === 'SUI' ? gasReserve : 0n} for gas), have ${totalBalance}`,
          ErrorCodes.INVALID_AMOUNT
        );
      }

      // Check if pool requires DEEP tokens for fees
      const isWhitelisted = pool.poolName.includes('DEEP');
      const deepAmount = isWhitelisted ? 0 : 1;
      
      // If non-whitelisted pool, verify user has DEEP tokens for fees
      if (!isWhitelisted) {
        const deepConfig = getTokenConfig('DEEP');
        const deepCoins = await suiService.getClient().getCoins({
          owner: walletAddress,
          coinType: deepConfig.coinType,
        });
        
        const deepBalance = deepCoins.data?.reduce((sum, c) => sum + BigInt(c.balance), 0n) || 0n;
        const requiredDeep = toRawAmount('1', deepConfig.decimals); // 1 DEEP minimum
        
        if (deepBalance < requiredDeep) {
          throw new ApiError(
            400, 
            `Non-whitelisted pool requires DEEP tokens for fees. Please swap SUI → DEEP first on DEEP_SUI pool (0% fees).`,
            ErrorCodes.INVALID_AMOUNT
          );
        }
        
        console.log(`[DeepBookService] DEEP balance check passed: ${deepBalance} (required: ${requiredDeep})`);
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
        
        // ============================================
        // MANUAL MOVE CALL: Bypass SDK's broken coin selection
        // ============================================
        
        console.log(`[DeepBookService] Pool: ${pool.poolName}, Reversed: ${pool.isReversed}, Whitelisted: ${isWhitelisted}, DEEP fee: ${deepAmount}`);
        
        // DeepBook contract constants
        // Get package ID from the SDK's config (it knows the correct testnet address)
        const DEEPBOOK_PACKAGE = (deepBookClient as any).deepBook?.config?.DEEPBOOK_PACKAGE_ID 
          || "0xf95b06141ed4a174f239417323bde3f209b972f5930d8521ea38a52aff3a6ddf"; // testnet fallback
        const CLOCK_OBJECT = "0x6";
        
        console.log(`[DeepBookService] Using DeepBook package: ${DEEPBOOK_PACKAGE}`);
        
        // Pool object ID
        const poolId = pool.poolName === 'DEEP_SUI' 
          ? "0x48c95963e9eac37a316b7ae04a0deb761bcdcc2b67912374d6036e7f0e9bae9f"
          : pool.poolName === 'SUI_DBUSDC'
          ? "0x4405b50d791fd3346754e8171aaab6bc2ed26c2c46efdd033c14b30ae507ac33"
          : pool.poolName; // fallback to name
        
        console.log(`[DeepBookService] Using manual Move call for pool: ${poolId}`);
        
        // Get coin type configs
        const tokenInConfig = getTokenConfig(tokenIn as TokenSymbol);
        const tokenOutConfig = getTokenConfig(tokenOut as TokenSymbol);
        const deepConfig = getTokenConfig('DEEP');
        
        // Convert minOut to raw units
        const minOutRaw = toRawAmount(minAmountOut, tokenOutConfig.decimals);
        console.log(`[DeepBookService] minOutRaw: ${minOutRaw}`);
        
        // Build manual swap based on pool direction
        if (pool.isReversed) {
          // Pool is DEEP_SUI (Base=DEEP, Quote=SUI)
          // We're swapping SUI → DEEP (quote → base)
          console.log(`[DeepBookService] Manual swap: SUI (quote) → DEEP (base) using DEEP_SUI pool`);
          
          if (tokenIn === 'SUI') {
            // 1. Split SUI from gas coin (this is your REAL input)
            const [suiCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInRaw)]);
            console.log(`[DeepBookService] Split ${amountInRaw} SUI from gas coin`);
            
            // 2. Create zero DEEP coin for base_in (we're swapping SUI, not DEEP)
            const zeroDeepBase = tx.moveCall({
              target: '0x2::coin::zero',
              typeArguments: [deepConfig.coinType],
            });
            console.log(`[DeepBookService] Created zero DEEP coin for base_in`);
            
            // 3. Create zero DEEP coin for fees (whitelisted pool = 0 fees)
            const zeroDeepFee = tx.moveCall({
              target: '0x2::coin::zero',
              typeArguments: [deepConfig.coinType],
            });
            console.log(`[DeepBookService] Created zero DEEP coin for fees`);
            
            // 4. Call swap_exact_quantity directly
            console.log(`[DeepBookService] Calling pool::swap_exact_quantity with:`);
            console.log(`  - base_in: zero DEEP`);
            console.log(`  - quote_in: ${amountInRaw} SUI (REAL COIN!)`);
            console.log(`  - deep_in: zero DEEP`);
            console.log(`  - min_out: ${minOutRaw}`);
            
            const [baseOut, quoteOut, deepOut] = tx.moveCall({
              target: `${DEEPBOOK_PACKAGE}::pool::swap_exact_quantity`,
              typeArguments: [deepConfig.coinType, tokenInConfig.coinType], // [DEEP, SUI]
              arguments: [
                tx.object(poolId),         // pool
                zeroDeepBase,              // base_in (zero - not swapping DEEP)
                suiCoin,                   // quote_in (OUR SUI!)
                zeroDeepFee,               // deep_in for fees (zero - whitelisted)
                tx.pure.u64(minOutRaw),    // min_out
                tx.object(CLOCK_OBJECT),   // clock
              ],
            });
            
            console.log(`[DeepBookService] Swap call completed, transferring outputs`);
            tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
          } else {
            throw new ApiError(400, `Non-SUI to DEEP swaps not yet implemented`, ErrorCodes.INVALID_AMOUNT);
          }
        } else {
          // Normal pool (e.g., SUI_DBUSDC: Base=SUI, Quote=DBUSDC)
          // We're swapping SUI → DBUSDC (base → quote)
          console.log(`[DeepBookService] Manual swap: SUI (base) → ${tokenOut} (quote) using ${pool.poolName} pool`);
          
          if (tokenIn === 'SUI') {
            // 1. Split SUI from gas coin
            const [suiCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInRaw)]);
            console.log(`[DeepBookService] Split ${amountInRaw} SUI from gas coin`);
            
            // 2. Create zero coin for quote_in (we're swapping SUI for quote)
            const zeroQuote = tx.moveCall({
              target: '0x2::coin::zero',
              typeArguments: [tokenOutConfig.coinType],
            });
            console.log(`[DeepBookService] Created zero ${tokenOut} coin for quote_in`);
            
            // 3. Create DEEP coin for fees (non-whitelisted needs 1 DEEP)
            let deepFee;
            if (isWhitelisted) {
              deepFee = tx.moveCall({
                target: '0x2::coin::zero',
                typeArguments: [deepConfig.coinType],
              });
              console.log(`[DeepBookService] Created zero DEEP coin for fees (whitelisted)`);
            } else {
              // Get DEEP coins for fee
              const deepCoins = await suiService.getClient().getCoins({
                owner: walletAddress,
                coinType: deepConfig.coinType,
              });
              const deepAmountRaw = toRawAmount('1', deepConfig.decimals);
              const [deepCoin] = tx.splitCoins(tx.object(deepCoins.data[0].coinObjectId), [tx.pure.u64(deepAmountRaw)]);
              deepFee = deepCoin;
              console.log(`[DeepBookService] Split 1 DEEP for fees (non-whitelisted)`);
            }
            
            // 4. Call swap_exact_quantity
            console.log(`[DeepBookService] Calling pool::swap_exact_quantity with:`);
            console.log(`  - base_in: ${amountInRaw} SUI (REAL COIN!)`);
            console.log(`  - quote_in: zero ${tokenOut}`);
            console.log(`  - deep_in: ${isWhitelisted ? 'zero' : '1'} DEEP`);
            console.log(`  - min_out: ${minOutRaw}`);
            
            const [baseOut, quoteOut, deepOut] = tx.moveCall({
              target: `${DEEPBOOK_PACKAGE}::pool::swap_exact_quantity`,
              typeArguments: [tokenInConfig.coinType, tokenOutConfig.coinType], // [SUI, DBUSDC]
              arguments: [
                tx.object(poolId),         // pool
                suiCoin,                   // base_in (OUR SUI!)
                zeroQuote,                 // quote_in (zero - not swapping quote)
                deepFee,                   // deep_in for fees
                tx.pure.u64(minOutRaw),    // min_out
                tx.object(CLOCK_OBJECT),   // clock
              ],
            });
            
            console.log(`[DeepBookService] Swap call completed, transferring outputs`);
            tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
          } else {
            throw new ApiError(400, `Non-SUI swaps not yet implemented`, ErrorCodes.INVALID_AMOUNT);
          }
        }
        
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
