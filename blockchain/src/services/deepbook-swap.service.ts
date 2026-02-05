// src/services/deepbook-swap.service.ts

import { DeepBookClient } from '@mysten/deepbook-v3';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Transaction } from '@mysten/sui/transactions';
import { config } from '../config/index.js';

/**
 * DeepBook V3 Swap Service using the correct SDK pattern
 * Based on official docs: https://docs.sui.io/standards/deepbookv3-sdk
 */
export class DeepBookSwapService {
  private env: 'testnet' | 'mainnet';
  private client: SuiJsonRpcClient;

  constructor(env: 'testnet' | 'mainnet' = 'testnet') {
    this.env = env;
    this.client = new SuiJsonRpcClient({
      network: env,
      url: env === 'mainnet'
        ? 'https://fullnode.mainnet.sui.io:443'
        : 'https://fullnode.testnet.sui.io:443',
    });
    console.log(`[DeepBookSwapService] Initialized for ${env}`);
  }

  /**
   * Create a DeepBook client for a specific user address
   */
  private createDeepBookClient(userAddress: string): DeepBookClient {
    console.log(`[DeepBookSwapService] Creating DeepBook client for ${userAddress}`);
    
    const deepbookClient = new DeepBookClient({
      address: userAddress,
      client: this.client,
      network: this.env,
    } as any);

    return deepbookClient;
  }

  /**
   * Build a swap transaction for SUI → DEEP (or any supported pair)
   * 
   * @param walletAddress - User's wallet address
   * @param poolKey - Pool key (e.g., 'DEEP_SUI', 'SUI_DBUSDC')
   * @param amount - Amount to swap (human readable)
   * @param minOut - Minimum output amount (human readable)
   * @param isBaseToCoin - true = base→quote, false = quote→base
   */
  async buildSwapTransaction(params: {
    walletAddress: string;
    poolKey: string;
    amount: number;
    minOut: number;
    isBaseToCoin: boolean;
    deepAmount?: number;
  }): Promise<{ txBytes: string }> {
    const { walletAddress, poolKey, amount, minOut, isBaseToCoin, deepAmount = 0 } = params;

    console.log(`[DeepBookSwapService] Building swap transaction`);
    console.log(`[DeepBookSwapService] Pool: ${poolKey}`);
    console.log(`[DeepBookSwapService] Amount: ${amount}`);
    console.log(`[DeepBookSwapService] Direction: ${isBaseToCoin ? 'base→quote' : 'quote→base'}`);
    console.log(`[DeepBookSwapService] Min out: ${minOut}`);
    console.log(`[DeepBookSwapService] DEEP for fees: ${deepAmount}`);

    // Create DeepBook client
    const deepbookClient = this.createDeepBookClient(walletAddress);

    // Create transaction
    const tx = new Transaction();
    tx.setSender(walletAddress);

    // CRITICAL: Split the coin FIRST, before calling SDK
    // This ensures we pass a REAL coin, not let SDK auto-select (which creates zero)
    const amountInMist = BigInt(Math.floor(amount * 1e9)); // Convert to MIST (9 decimals for SUI)
    
    console.log(`[DeepBookSwapService] Splitting ${amountInMist} MIST from gas coin`);
    const [suiCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);
    console.log(`[DeepBookSwapService] ✅ Split real SUI coin from gas`);

    // Add swap using deepbook SDK with EXPLICIT coin parameter
    // Pass the split coin as quoteCoin (for quote→base) or baseCoin (for base→quote)
    const swapParams: any = {
      poolKey: poolKey,
      amount: amount,
      deepAmount: deepAmount,
      minOut: minOut,
      isBaseToCoin: isBaseToCoin,
    };

    // Pass the REAL coin explicitly based on direction
    if (isBaseToCoin) {
      // Swapping base → quote (e.g., SUI → DBUSDC in SUI_DBUSDC pool)
      swapParams.baseCoin = suiCoin;
      console.log(`[DeepBookSwapService] Passing suiCoin as baseCoin parameter`);
    } else {
      // Swapping quote → base (e.g., SUI → DEEP in DEEP_SUI pool)
      swapParams.quoteCoin = suiCoin;
      console.log(`[DeepBookSwapService] Passing suiCoin as quoteCoin parameter`);
    }

    // Call SDK with explicit coin
    const swapResult = (deepbookClient as any).deepBook.swapExactQuantity(swapParams)(tx);

    console.log(`[DeepBookSwapService] Swap added to transaction`);

    // The swap returns [baseOut, quoteOut, deepOut] - transfer all of them
    if (Array.isArray(swapResult)) {
      const [baseOut, quoteOut, deepOut] = swapResult;
      console.log(`[DeepBookSwapService] Transferring swap outputs to wallet`);
      tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
    } else {
      console.log(`[DeepBookSwapService] Transferring single swap output to wallet`);
      tx.transferObjects([swapResult], walletAddress);
    }

    // Build transaction bytes
    const txBytes = await tx.build({ client: this.client });
    
    console.log(`[DeepBookSwapService] Transaction built, ${txBytes.length} bytes`);

    return {
      txBytes: Buffer.from(txBytes).toString('base64'),
    };
  }

  /**
   * Swap SUI for DEEP using DEEP_SUI pool (whitelisted, 0 fees)
   */
  async buildSuiToDeepSwap(params: {
    walletAddress: string;
    amountSui: string;
    minDeepOut: string;
  }): Promise<{ txBytes: string }> {
    const { walletAddress, amountSui, minDeepOut } = params;

    console.log(`[DeepBookSwapService] Building SUI → DEEP swap`);
    console.log(`[DeepBookSwapService] Input: ${amountSui} SUI`);
    console.log(`[DeepBookSwapService] Min output: ${minDeepOut} DEEP`);

    // DEEP_SUI pool: DEEP is base, SUI is quote
    // To swap SUI → DEEP, we go quote → base
    // So isBaseToCoin = false
    return this.buildSwapTransaction({
      walletAddress,
      poolKey: 'DEEP_SUI',
      amount: parseFloat(amountSui),
      minOut: parseFloat(minDeepOut),
      isBaseToCoin: false,  // SUI (quote) → DEEP (base)
      deepAmount: 0,        // Whitelisted pool = 0 fees
    });
  }

  /**
   * Swap DEEP for SUI using DEEP_SUI pool (whitelisted, 0 fees)
   */
  async buildDeepToSuiSwap(params: {
    walletAddress: string;
    amountDeep: string;
    minSuiOut: string;
  }): Promise<{ txBytes: string }> {
    const { walletAddress, amountDeep, minSuiOut } = params;

    console.log(`[DeepBookSwapService] Building DEEP → SUI swap`);

    // DEEP_SUI pool: DEEP is base, SUI is quote
    // To swap DEEP → SUI, we go base → quote
    // So isBaseToCoin = true
    return this.buildSwapTransaction({
      walletAddress,
      poolKey: 'DEEP_SUI',
      amount: parseFloat(amountDeep),
      minOut: parseFloat(minSuiOut),
      isBaseToCoin: true,  // DEEP (base) → SUI (quote)
      deepAmount: 0,       // Whitelisted pool = 0 fees
    });
  }

  /**
   * Swap SUI for DBUSDC using SUI_DBUSDC pool
   * Note: This pool is NOT whitelisted, so you need DEEP for fees
   */
  async buildSuiToDbUsdcSwap(params: {
    walletAddress: string;
    amountSui: string;
    minDbUsdcOut: string;
    deepAmount?: string;
  }): Promise<{ txBytes: string }> {
    const { walletAddress, amountSui, minDbUsdcOut, deepAmount = '1' } = params;

    console.log(`[DeepBookSwapService] Building SUI → DBUSDC swap`);

    // SUI_DBUSDC pool: SUI is base, DBUSDC is quote
    // To swap SUI → DBUSDC, we go base → quote
    // So isBaseToCoin = true
    return this.buildSwapTransaction({
      walletAddress,
      poolKey: 'SUI_DBUSDC',
      amount: parseFloat(amountSui),
      minOut: parseFloat(minDbUsdcOut),
      isBaseToCoin: true,   // SUI (base) → DBUSDC (quote)
      deepAmount: parseFloat(deepAmount),  // Need DEEP for fees!
    });
  }
}

// Export singleton
export const deepBookSwapService = new DeepBookSwapService('testnet');
