"use client";

import { useState, useCallback } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { Transaction } from "@mysten/sui/transactions";
import { deepbook, type DeepBookClient } from '@mysten/deepbook-v3';
import type { ClientWithExtensions } from '@mysten/sui/client';
import { Ed25519PublicKey } from "@mysten/sui/keypairs/ed25519";
import { messageWithIntent } from "@mysten/sui/cryptography";
import { blake2b } from "@noble/hashes/blake2b";
import { bytesToHex } from "@noble/hashes/utils";
import { bcs } from '@mysten/sui/bcs';

export function useUniversalSwap() {
  // Browser wallets (Suiet, Welldone, Sui Wallet)
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  
  // Turnkey wallet
  const turnkeyHook = useTurnkey();
  const { wallets: turnkeyWallets } = turnkeyHook;
  const turnkeyWallet = turnkeyWallets?.[0];
  const turnkeyAddress = turnkeyWallet?.accounts?.[0]?.address;
  const turnkeyPublicKey = turnkeyWallet?.accounts?.[0]?.publicKey;
  const httpClient = (turnkeyHook as any).httpClient;
  
  // Determine which wallet is connected
  const walletAddress = currentAccount?.address || turnkeyAddress;
  const walletType = currentAccount ? 'standard' : (turnkeyAddress ? 'turnkey' : null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  console.log(`[useUniversalSwap] Wallet Type: ${walletType}, Address: ${walletAddress}`);

  // Execute swap with automatic wallet detection
  const executeSwap = useCallback(
    async (tokenIn: string, tokenOut: string, amountIn: string, slippage: number = 0.01) => {
      console.log(`[useUniversalSwap] executeSwap: ${amountIn} ${tokenIn} -> ${tokenOut} (${walletType})`);

      if (!walletAddress) {
        const error = "Wallet not connected";
        console.error("[useUniversalSwap]", error);
        setError(error);
        return null;
      }

      setLoading(true);
      setError(null);
      setTxDigest(null);

      try {
        // For simplicity: Use 0 as minOut to avoid slippage issues during testing
        // TODO: Implement proper quote mechanism using SDK dry-run methods
        const minAmountOut = "0";
        
        console.log("[useUniversalSwap] Using minAmountOut=0 (no slippage protection for testing)");
        
        // Build transaction on frontend
        console.log("[useUniversalSwap] Building transaction on frontend...");
        const tx = await buildSwapTransactionFrontend(
          tokenIn,
          tokenOut,
          amountIn,
          minAmountOut,
          walletAddress,
          suiClient
        );

        // Execute transaction based on wallet type
        console.log(`[useUniversalSwap] Executing with ${walletType} wallet...`);
        
        let resultDigest: string;
        
        if (walletType === 'standard') {
          // Browser wallet execution
          resultDigest = await new Promise<string>((resolve, reject) => {
            signAndExecute(
              { transaction: tx },
              {
                onSuccess: (result) => {
                  console.log("[useUniversalSwap] ✅ Swap successful! Digest:", result.digest);
                  resolve(result.digest);
                },
                onError: (err) => {
                  console.error("[useUniversalSwap] ❌ Swap failed:", err);
                  reject(err);
                },
              }
            );
          });
        } else if (walletType === 'turnkey') {
          // Turnkey wallet execution (following official docs)
          console.log("[useUniversalSwap] Signing with Turnkey...");
          
          if (!httpClient || !turnkeyPublicKey) {
            throw new Error("Turnkey client or public key not available");
          }

          // Build transaction bytes
          const { SuiGrpcClient } = await import('@mysten/sui/grpc');
          const grpcClient = new SuiGrpcClient({
            network: 'testnet',
            baseUrl: 'https://fullnode.testnet.sui.io:443',
          });

          // Build transaction to get raw bytes
          const builtTx = await tx.build({ client: grpcClient });
          
          // Create digest for signing (following Turnkey docs)
          const intentMessage = messageWithIntent('TransactionData', builtTx);
          const digest = blake2b(intentMessage, { dkLen: 32 });
          const hexDigest = bytesToHex(digest);

          console.log("[useUniversalSwap] Transaction digest:", hexDigest);

          // Sign with Turnkey using signRawPayload (official pattern)
          const signResponse = await httpClient.signRawPayload({
            signWith: turnkeyAddress,
            payload: hexDigest,
            encoding: 'PAYLOAD_ENCODING_HEXADECIMAL',
            hashFunction: 'HASH_FUNCTION_NOT_APPLICABLE',
          });

          console.log("[useUniversalSwap] Signature received from Turnkey");

          // Serialize signature for Sui (official pattern)
          const publicKey = new Ed25519PublicKey(Buffer.from(turnkeyPublicKey, 'hex'));
          const signatureBytes = Buffer.from(signResponse.r + signResponse.s, 'hex');
          const publicKeyBytes = publicKey.toRawBytes();
          
          const serializedSignature = Buffer.concat([
            Buffer.from([0x00]), // ED25519 flag
            signatureBytes,
            publicKeyBytes,
          ]).toString('base64');

          // Execute transaction
          const result = await grpcClient.executeTransaction({
            transaction: builtTx,
            signature: serializedSignature,
          });

          resultDigest = result.digest;

          console.log("[useUniversalSwap] ✅ Turnkey swap successful! Digest:", resultDigest);
        } else {
          throw new Error("No wallet connected");
        }

        console.log(`[useUniversalSwap] ✅ SUCCESS! Digest: ${resultDigest}`);
        
        // Wait a bit for the transaction to be processed
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check DEEP balance after swap
        try {
          const deepCoins = await suiClient.getCoins({
            owner: walletAddress,
            coinType: "0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8::deep::DEEP"
          });
          const deepBalance = deepCoins.data.reduce((sum, coin) => sum + BigInt(coin.balance), 0n);
          console.log(`[useUniversalSwap] DEEP balance after swap: ${deepBalance} (${Number(deepBalance) / 1e6} DEEP)`);
          console.log(`[useUniversalSwap] DEEP coins found:`, deepCoins.data.length);
        } catch (e) {
          console.error("[useUniversalSwap] Error checking DEEP balance:", e);
        }
        
        setTxDigest(resultDigest);
        return resultDigest;

      } catch (err: any) {
        console.error("[useUniversalSwap] Error:", err);
        setError(err.message || "Swap failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, walletType, currentAccount, signAndExecute, turnkeyWallet, turnkeyAddress, turnkeyPublicKey, httpClient, turnkeyHook, suiClient]
  );

  const reset = useCallback(() => {
    setError(null);
    setTxDigest(null);
  }, []);

  return {
    loading,
    error,
    txDigest,
    executeSwap,
    reset,
    walletType, // Expose wallet type for UI
  };
}

// Build swap transaction using DeepBook SDK
async function buildSwapTransactionFrontend(
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  minAmountOut: string,
  walletAddress: string,
  suiClient: any,
) {
  console.log(`[buildSwapTransactionFrontend] Building ${tokenIn} -> ${tokenOut} swap with DeepBook SDK`);
  
  const { SuiGrpcClient } = await import('@mysten/sui/grpc');

  type DeepBookExtendedClient = ClientWithExtensions<{ deepbook: DeepBookClient }>;

  const deepbookClient: DeepBookExtendedClient = new SuiGrpcClient({
    network: 'testnet',
    baseUrl: 'https://fullnode.testnet.sui.io:443',
  }).$extend(
    deepbook({
      address: walletAddress,
    }),
  );

  const tx = new Transaction();
  tx.setSender(walletAddress);

  // SDK expects decimal amounts (e.g., 1.0 for 1 SUI), not base units
  // The SDK internally handles conversion to base units
  const amount = parseFloat(amountIn);
  const minOut = parseFloat(minAmountOut);

  console.log(`[buildSwapTransactionFrontend] Amount: ${amount} ${tokenIn}`);
  console.log(`[buildSwapTransactionFrontend] MinOut: ${minOut} ${tokenOut}`);

  // Determine swap direction
  if (tokenIn === "SUI" && tokenOut === "DEEP") {
    // SUI -> DEEP: In DEEP_SUI pool, DEEP is base, SUI is quote
    // So we swap quote -> base
    console.log("[SDK] swapExactQuoteForBase: SUI (quote) -> DEEP (base)");
    
    // Manually split SUI from tx.gas before passing to SDK
    const amountInMist = BigInt(Math.floor(amount * 1e9));
    const [suiCoin] = tx.splitCoins(tx.gas, [amountInMist]);
    
    const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.deepBook.swapExactQuoteForBase({
      poolKey: 'DEEP_SUI',
      amount,
      deepAmount: 0, // whitelisted pool
      minOut,
      quoteCoin: suiCoin, // Pass explicit coin split from gas
    })(tx);

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
    
  } else if (tokenIn === "DEEP" && tokenOut === "SUI") {
    // DEEP -> SUI: swap base -> quote
    console.log("[SDK] swapExactBaseForQuote: DEEP (base) -> SUI (quote)");
    
    const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.deepBook.swapExactBaseForQuote({
      poolKey: 'DEEP_SUI',
      amount,
      deepAmount: 0, // whitelisted pool
      minOut,
    })(tx);

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
    
  } else if (tokenIn === "SUI" && tokenOut === "DBUSDC") {
    // SUI -> DBUSDC: In SUI_DBUSDC pool, SUI is base, DBUSDC is quote
    console.log("[SDK] swapExactBaseForQuote: SUI (base) -> DBUSDC (quote)");
    
    // Manually split SUI from tx.gas before passing to SDK
    const amountInMist = BigInt(Math.floor(amount * 1e9));
    const [suiCoin] = tx.splitCoins(tx.gas, [amountInMist]);
    
    const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.deepBook.swapExactBaseForQuote({
      poolKey: 'SUI_DBUSDC',
      amount,
      deepAmount: 1, // non-whitelisted, needs DEEP for fees
      minOut,
      baseCoin: suiCoin, // Pass explicit coin split from gas
    })(tx);

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
    
  } else if (tokenIn === "DBUSDC" && tokenOut === "SUI") {
    // DBUSDC -> SUI: swap quote -> base
    console.log("[SDK] swapExactQuoteForBase: DBUSDC (quote) -> SUI (base)");
    
    const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.deepBook.swapExactQuoteForBase({
      poolKey: 'SUI_DBUSDC',
      amount,
      deepAmount: 1, // non-whitelisted, needs DEEP for fees
      minOut,
    })(tx);

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
    
  } else {
    throw new Error(`Unsupported swap: ${tokenIn} -> ${tokenOut}`);
  }

  console.log("[buildSwapTransactionFrontend] Transaction built successfully");
  return tx;
}
