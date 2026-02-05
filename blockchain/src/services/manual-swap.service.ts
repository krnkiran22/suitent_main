// src/services/manual-swap.service.ts

import { SuiGrpcClient } from '@mysten/sui/grpc';
import { deepbook, type DeepBookClient } from '@mysten/deepbook-v3';
import type { ClientWithExtensions } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

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

type DeepBookExtendedClient = ClientWithExtensions<{ deepbook: DeepBookClient }>;

/**
 * DeepBook swap service using official SDK
 * This service EXECUTES swaps on behalf of users (signs with backend keypair)
 */
export class ManualSwapService {
  private env: 'testnet' | 'mainnet';
  private signer: Ed25519Keypair | null = null;

  constructor(env: 'testnet' | 'mainnet' = 'testnet') {
    this.env = env;
    console.log(`[ManualSwapService] Initialized for ${env} with DeepBook SDK`);
  }

  /**
   * Initialize signer from private key (hex string without 0x prefix)
   */
  initializeSigner(privateKeyHex: string) {
    try {
      // Remove 0x prefix if present
      const cleanKey = privateKeyHex.replace(/^0x/, '');
      // Convert hex to Uint8Array
      const privateKeyBytes = Uint8Array.from(Buffer.from(cleanKey, 'hex'));
      this.signer = Ed25519Keypair.fromSecretKey(privateKeyBytes);
      console.log('[ManualSwapService] Signer initialized:', this.signer.getPublicKey().toSuiAddress());
    } catch (error) {
      console.error('[ManualSwapService] Failed to initialize signer:', error);
      throw new Error('Invalid private key format');
    }
  }

  private createDeepBookClient(walletAddress: string): DeepBookExtendedClient {
    return new SuiGrpcClient({
      network: this.env,
      baseUrl: this.env === 'mainnet'
        ? 'https://fullnode.mainnet.sui.io:443'
        : 'https://fullnode.testnet.sui.io:443',
    }).$extend(
      deepbook({
        address: walletAddress,
      }),
    );
  }

  /**
   * Execute SUI → DEEP swap (builds, signs, executes)
   */
  async executeSuiToDeepSwap(params: {
    walletAddress: string;
    amountSui: string;
    minDeepOut: string;
  }): Promise<{ digest: string }> {
    if (!this.signer) {
      throw new Error('Signer not initialized. Call initializeSigner first.');
    }

    const { walletAddress, amountSui, minDeepOut } = params;

    console.log('[ManualSwapService] Executing SUI → DEEP swap');
    console.log('[ManualSwapService] Amount:', amountSui, 'SUI');
    console.log('[ManualSwapService] Min out:', minDeepOut, 'DEEP');

    const deepbookClient = this.createDeepBookClient(walletAddress);
    const tx = new Transaction();
    tx.setSender(walletAddress);

    const amount = parseFloat(amountSui);
    const minOut = parseFloat(minDeepOut);

    console.log('[ManualSwapService] Using swapExactQuoteForBase: SUI (quote) -> DEEP (base)');

    const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.swapExactQuoteForBase({
      poolKey: 'DEEP_SUI',
      amount,
      deepAmount: 0, // whitelisted pool
      minOut,
    })(tx);

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);

    // Sign and execute
    const result = await deepbookClient.signAndExecuteTransaction({
      transaction: tx,
      signer: this.signer,
    });

    console.log('[ManualSwapService] ✅ Swap executed! Digest:', result.digest);
    return { digest: result.digest };
  }

  /**
   * Execute DEEP → SUI swap
   */
  async executeDeepToSuiSwap(params: {
    walletAddress: string;
    amountDeep: string;
    minSuiOut: string;
  }): Promise<{ digest: string }> {
    if (!this.signer) {
      throw new Error('Signer not initialized. Call initializeSigner first.');
    }

    const { walletAddress, amountDeep, minSuiOut } = params;

    console.log('[ManualSwapService] Executing DEEP → SUI swap');

    const deepbookClient = this.createDeepBookClient(walletAddress);
    const tx = new Transaction();
    tx.setSender(walletAddress);

    const amount = parseFloat(amountDeep);
    const minOut = parseFloat(minSuiOut);

    console.log('[ManualSwapService] Using swapExactBaseForQuote: DEEP (base) -> SUI (quote)');

    const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.swapExactBaseForQuote({
      poolKey: 'DEEP_SUI',
      amount,
      deepAmount: 0, // whitelisted pool
      minOut,
    })(tx);

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);

    const result = await deepbookClient.signAndExecuteTransaction({
      transaction: tx,
      signer: this.signer,
    });

    console.log('[ManualSwapService] ✅ DEEP → SUI swap executed! Digest:', result.digest);
    return { digest: result.digest };
  }

  /**
   * Execute SUI → DBUSDC swap (requires DEEP for fees)
   */
  async executeSuiToDbUsdcSwap(params: {
    walletAddress: string;
    amountSui: string;
    minDbUsdcOut: string;
    deepAmount?: string;
  }): Promise<{ digest: string }> {
    if (!this.signer) {
      throw new Error('Signer not initialized. Call initializeSigner first.');
    }

    const { walletAddress, amountSui, minDbUsdcOut, deepAmount = '1' } = params;

    console.log('[ManualSwapService] Executing SUI → DBUSDC swap');

    const deepbookClient = this.createDeepBookClient(walletAddress);
    const tx = new Transaction();
    tx.setSender(walletAddress);

    const amount = parseFloat(amountSui);
    const minOut = parseFloat(minDbUsdcOut);

    console.log('[ManualSwapService] Using swapExactBaseForQuote: SUI (base) -> DBUSDC (quote)');

    const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.swapExactBaseForQuote({
      poolKey: 'SUI_DBUSDC',
      amount,
      deepAmount: 1, // non-whitelisted, needs DEEP for fees
      minOut,
    })(tx);

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);

    const result = await deepbookClient.signAndExecuteTransaction({
      transaction: tx,
      signer: this.signer,
    });

    console.log('[ManualSwapService] ✅ SUI → DBUSDC swap executed! Digest:', result.digest);
    return { digest: result.digest };
  }
}

// Export singleton
export const manualSwapService = new ManualSwapService('testnet');
