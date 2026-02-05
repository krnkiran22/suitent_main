// src/services/manual-swap.service.ts

import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Transaction } from '@mysten/sui/transactions';
import { getTokenConfig } from '../config/tokens.js';

// Testnet addresses (verified from DeepBook)
const TESTNET = {
  DEEPBOOK_PACKAGE: '0x22be4cade64bf2d02412c7e8d0e8beea2f78828b948118d46735315409371a3c',
  DEEP_TYPE: '0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8::deep::DEEP',
  SUI_TYPE: '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
  DBUSDC_TYPE: '0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDC::DBUSDC',
  DEEP_SUI_POOL: '0x48c95963e9eac37a316b7ae04a0deb761bcdcc2b67912374d6036e7f0e9bae9f',
  SUI_DBUSDC_POOL: '0x4405b50d791fd3346754e8171aaab6bc2ed26c2c46efdd033c14b30ae507ac33',
  CLOCK: '0x0000000000000000000000000000000000000000000000000000000000000006',
};

/**
 * Manual DeepBook swap service that bypasses the broken SDK
 */
export class ManualSwapService {
  private client: SuiJsonRpcClient;

  constructor(env: 'testnet' | 'mainnet' = 'testnet') {
    this.client = new SuiJsonRpcClient({
      network: env,
      url: env === 'mainnet'
        ? 'https://fullnode.mainnet.sui.io:443'
        : 'https://fullnode.testnet.sui.io:443',
    });
    console.log(`[ManualSwapService] Initialized for ${env}`);
  }

  /**
   * Build SUI → DEEP swap manually (bypasses SDK)
   */
  async buildSuiToDeepSwap(params: {
    walletAddress: string;
    amountSui: string;
    minDeepOut: string;
  }): Promise<{ txBytes: string }> {
    const { walletAddress, amountSui, minDeepOut } = params;

    console.log('[ManualSwapService] Building SUI → DEEP swap');
    console.log('[ManualSwapService] Amount:', amountSui, 'SUI');
    console.log('[ManualSwapService] Min out:', minDeepOut, 'DEEP');

    const tx = new Transaction();
    tx.setSender(walletAddress);

    // Convert amounts (SUI = 9 decimals, DEEP = 6 decimals)
    const amountInRaw = BigInt(Math.floor(parseFloat(amountSui) * 1e9));
    const minOutRaw = BigInt(Math.floor(parseFloat(minDeepOut) * 1e6));

    console.log('[ManualSwapService] Amount raw:', amountInRaw.toString());
    console.log('[ManualSwapService] Min out raw:', minOutRaw.toString());

    // 1. Split SUI from gas coin - THIS IS YOUR REAL INPUT
    const [suiCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInRaw)]);
    console.log('[ManualSwapService] ✅ Split real SUI coin from gas');

    // 2. Create zero DEEP coin for base_in (we're swapping SUI, not DEEP)
    const zeroDeepBase = tx.moveCall({
      target: '0x2::coin::zero',
      typeArguments: [TESTNET.DEEP_TYPE],
    });
    console.log('[ManualSwapService] Created zero DEEP for base_in');

    // 3. Create zero DEEP coin for fees (whitelisted pool = 0 fees)
    const zeroDeepFee = tx.moveCall({
      target: '0x2::coin::zero',
      typeArguments: [TESTNET.DEEP_TYPE],
    });
    console.log('[ManualSwapService] Created zero DEEP for fees');

    // 4. Call swap_exact_quantity directly on the pool
    // DEEP_SUI pool: Base=DEEP, Quote=SUI
    // We're swapping SUI (quote) → DEEP (base)
    console.log('[ManualSwapService] Calling pool::swap_exact_quantity');
    console.log('[ManualSwapService]   - pool: DEEP_SUI');
    console.log('[ManualSwapService]   - base_in: 0 DEEP (not swapping DEEP)');
    console.log('[ManualSwapService]   - quote_in: YOUR REAL SUI COIN ✅');
    console.log('[ManualSwapService]   - deep_in: 0 DEEP (whitelisted)');
    console.log('[ManualSwapService]   - min_out:', minOutRaw.toString());

    const [baseOut, quoteOut, deepOut] = tx.moveCall({
      target: `${TESTNET.DEEPBOOK_PACKAGE}::pool::swap_exact_quantity`,
      typeArguments: [TESTNET.DEEP_TYPE, TESTNET.SUI_TYPE],
      arguments: [
        tx.object(TESTNET.DEEP_SUI_POOL),  // pool
        zeroDeepBase,                       // base_in (0 DEEP)
        suiCoin,                            // quote_in (YOUR SUI!) ← THE KEY!
        zeroDeepFee,                        // deep_in (0 DEEP - whitelisted)
        tx.pure.u64(minOutRaw),             // min_out
        tx.object(TESTNET.CLOCK),           // clock
      ],
    });

    console.log('[ManualSwapService] ✅ Swap call added');

    // 5. Transfer all outputs to wallet
    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
    console.log('[ManualSwapService] ✅ Transfer added');

    // Build transaction
    const txBytes = await tx.build({ client: this.client });
    console.log('[ManualSwapService] ✅ Built transaction, bytes:', txBytes.length);

    return {
      txBytes: Buffer.from(txBytes).toString('base64'),
    };
  }

  /**
   * Build DEEP → SUI swap manually
   */
  async buildDeepToSuiSwap(params: {
    walletAddress: string;
    amountDeep: string;
    minSuiOut: string;
  }): Promise<{ txBytes: string }> {
    const { walletAddress, amountDeep, minSuiOut } = params;

    console.log('[ManualSwapService] Building DEEP → SUI swap');

    const tx = new Transaction();
    tx.setSender(walletAddress);

    // Convert amounts
    const amountInRaw = BigInt(Math.floor(parseFloat(amountDeep) * 1e6));
    const minOutRaw = BigInt(Math.floor(parseFloat(minSuiOut) * 1e9));

    // Get DEEP coins
    const deepCoins = await this.client.getCoins({
      owner: walletAddress,
      coinType: TESTNET.DEEP_TYPE,
    });

    if (!deepCoins.data || deepCoins.data.length === 0) {
      throw new Error('No DEEP coins found in wallet');
    }

    // Split DEEP from first coin
    const [deepCoin] = tx.splitCoins(
      tx.object(deepCoins.data[0].coinObjectId),
      [tx.pure.u64(amountInRaw)]
    );

    // Create zero SUI for quote_in
    const zeroSui = tx.moveCall({
      target: '0x2::coin::zero',
      typeArguments: [TESTNET.SUI_TYPE],
    });

    // Create zero DEEP for fees
    const zeroDeepFee = tx.moveCall({
      target: '0x2::coin::zero',
      typeArguments: [TESTNET.DEEP_TYPE],
    });

    // Call swap: DEEP (base) → SUI (quote)
    const [baseOut, quoteOut, deepOut] = tx.moveCall({
      target: `${TESTNET.DEEPBOOK_PACKAGE}::pool::swap_exact_quantity`,
      typeArguments: [TESTNET.DEEP_TYPE, TESTNET.SUI_TYPE],
      arguments: [
        tx.object(TESTNET.DEEP_SUI_POOL),
        deepCoin,                     // base_in (YOUR DEEP!)
        zeroSui,                      // quote_in (0 SUI)
        zeroDeepFee,                  // deep_in (0 - whitelisted)
        tx.pure.u64(minOutRaw),       // min_out
        tx.object(TESTNET.CLOCK),
      ],
    });

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);

    const txBytes = await tx.build({ client: this.client });
    console.log('[ManualSwapService] Built DEEP → SUI swap');

    return {
      txBytes: Buffer.from(txBytes).toString('base64'),
    };
  }

  /**
   * Build SUI → DBUSDC swap manually (requires DEEP for fees)
   */
  async buildSuiToDbUsdcSwap(params: {
    walletAddress: string;
    amountSui: string;
    minDbUsdcOut: string;
    deepAmount?: string;
  }): Promise<{ txBytes: string }> {
    const { walletAddress, amountSui, minDbUsdcOut, deepAmount = '1' } = params;

    console.log('[ManualSwapService] Building SUI → DBUSDC swap');

    const tx = new Transaction();
    tx.setSender(walletAddress);

    const amountInRaw = BigInt(Math.floor(parseFloat(amountSui) * 1e9));
    const minOutRaw = BigInt(Math.floor(parseFloat(minDbUsdcOut) * 1e6));
    const deepAmountRaw = BigInt(Math.floor(parseFloat(deepAmount) * 1e6));

    // Split SUI from gas
    const [suiCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInRaw)]);

    // Create zero DBUSDC for quote_in
    const zeroDbUsdc = tx.moveCall({
      target: '0x2::coin::zero',
      typeArguments: [TESTNET.DBUSDC_TYPE],
    });

    // Split DEEP for fees
    const deepCoins = await this.client.getCoins({
      owner: walletAddress,
      coinType: TESTNET.DEEP_TYPE,
    });

    if (!deepCoins.data || deepCoins.data.length === 0) {
      throw new Error('No DEEP coins found. You need DEEP tokens for fees on non-whitelisted pools.');
    }

    const [deepFee] = tx.splitCoins(
      tx.object(deepCoins.data[0].coinObjectId),
      [tx.pure.u64(deepAmountRaw)]
    );

    // Call swap: SUI (base) → DBUSDC (quote)
    const [baseOut, quoteOut, deepOut] = tx.moveCall({
      target: `${TESTNET.DEEPBOOK_PACKAGE}::pool::swap_exact_quantity`,
      typeArguments: [TESTNET.SUI_TYPE, TESTNET.DBUSDC_TYPE],
      arguments: [
        tx.object(TESTNET.SUI_DBUSDC_POOL),
        suiCoin,                      // base_in (YOUR SUI!)
        zeroDbUsdc,                   // quote_in (0 DBUSDC)
        deepFee,                      // deep_in (DEEP for fees!)
        tx.pure.u64(minOutRaw),       // min_out
        tx.object(TESTNET.CLOCK),
      ],
    });

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);

    const txBytes = await tx.build({ client: this.client });
    console.log('[ManualSwapService] Built SUI → DBUSDC swap');

    return {
      txBytes: Buffer.from(txBytes).toString('base64'),
    };
  }
}

// Export singleton
export const manualSwapService = new ManualSwapService('testnet');
