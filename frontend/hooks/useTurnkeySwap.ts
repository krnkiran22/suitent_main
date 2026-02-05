"use client";

import { useState, useCallback } from "react";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519PublicKey } from "@mysten/sui/keypairs/ed25519";
import { messageWithIntent } from "@mysten/sui/cryptography";
import { blake2b } from "@noble/hashes/blake2b";
import { bytesToHex } from "@noble/hashes/utils";
import { deepbook, type DeepBookClient } from '@mysten/deepbook-v3';
import type { ClientWithExtensions } from '@mysten/sui/client';
import { bcs } from '@mysten/sui/bcs';

type DeepBookExtendedClient = ClientWithExtensions<{ deepbook: DeepBookClient }>;

export function useTurnkeySwap() {
  const turnkeyHook = useTurnkey();
  const { wallets } = turnkeyHook;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const walletAddress = wallets?.[0]?.accounts?.[0]?.address;
  const walletPublicKey = wallets?.[0]?.accounts?.[0]?.publicKey;
  
  // Get Turnkey HTTP client for signing
  const httpClient = (turnkeyHook as any).httpClient;

  console.log("[useTurnkeySwap] Wallet:", walletAddress);
  console.log("[useTurnkeySwap] HTTP Client:", !!httpClient);

  // Execute swap with Turnkey wallet
  const executeSwap = useCallback(
    async (tokenIn: string, tokenOut: string, amountIn: string) => {
      console.log(`[useTurnkeySwap] executeSwap: ${amountIn} ${tokenIn} -> ${tokenOut}`);

      if (!walletAddress) {
        const error = "Turnkey wallet not connected";
        console.error("[useTurnkeySwap]", error);
        setError(error);
        return null;
      }

      if (!httpClient) {
        const error = "Turnkey HTTP client not available";
        console.error("[useTurnkeySwap]", error);
        setError(error);
        return null;
      }

      setLoading(true);
      setError(null);
      setTxDigest(null);

      try {
        // Use minAmountOut=0 for testing (no slippage protection)
        const minAmountOut = "0";
        
        console.log("[useTurnkeySwap] Building transaction...");
        const tx = await buildSwapTransactionFrontend(
          tokenIn,
          tokenOut,
          amountIn,
          minAmountOut,
          walletAddress,
        );

        // Build transaction bytes for signing
        console.log("[useTurnkeySwap] Building transaction bytes...");
        const builtTx = await tx.build({
          client: await getSuiGrpcClient(),
        });

        const intentMessage = messageWithIntent('TransactionData', builtTx);
        const digest = blake2b(intentMessage, { dkLen: 32 });
        const hexDigest = bytesToHex(digest);

        console.log("[useTurnkeySwap] Signing with Turnkey...");
        
        // Sign with Turnkey (following official pattern)
        const signResponse = await httpClient.signRawPayload({
          signWith: walletAddress,
          payload: hexDigest,
          encoding: 'PAYLOAD_ENCODING_HEXADECIMAL',
          hashFunction: 'HASH_FUNCTION_NOT_APPLICABLE',
        });

        const signature = signResponse.r + signResponse.s;
        console.log("[useTurnkeySwap] Signature received:", signature);

        if (!walletPublicKey) {
          throw new Error("Wallet public key not available");
        }

        // Construct full signature with pubkey
        // Ensure public key is 32 bytes (remove compression prefix if present)
        let publicKeyBytes: Uint8Array;
        const pubKeyHex = walletPublicKey.replace('0x', '');
        
        if (pubKeyHex.length === 96) {
          // 48 bytes - likely compressed, take last 32 bytes
          publicKeyBytes = Buffer.from(pubKeyHex.slice(32), 'hex');
        } else if (pubKeyHex.length === 64) {
          // 32 bytes - correct length
          publicKeyBytes = Buffer.from(pubKeyHex, 'hex');
        } else {
          throw new Error(`Invalid public key length: ${pubKeyHex.length / 2} bytes`);
        }
        
        const publicKey = new Ed25519PublicKey(publicKeyBytes);
        const signatureBytes = Buffer.from(signature, 'hex');
        const serializedSignature = Buffer.concat([
          Buffer.from([0]), // Ed25519 flag
          signatureBytes,
          publicKey.toRawBytes(),
        ]).toString('base64');

        console.log("[useTurnkeySwap] Executing transaction...");
        const client = await getSuiGrpcClient();
        const result = await client.executeTransaction({
          transaction: builtTx,
          signature: serializedSignature,
        });

        console.log("[useTurnkeySwap] Success! Digest:", result.digest);
        setTxDigest(result.digest);
        return result.digest;

      } catch (err: any) {
        console.error("[useTurnkeySwap] Error:", err);
        setError(err.message || "Swap failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, walletPublicKey, httpClient, wallets]
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
    walletAddress,
  };
}

// Build swap transaction using DeepBook SDK
async function buildSwapTransactionFrontend(
  tokenIn: string,
  tokenOut: string,
  amountIn: string,
  minAmountOut: string,
  walletAddress: string,
) {
  console.log(`[buildSwapTransactionFrontend] Building ${tokenIn} -> ${tokenOut} swap with DeepBook SDK`);
  
  const { SuiGrpcClient } = await import('@mysten/sui/grpc');

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

  const amount = parseFloat(amountIn);
  const minOut = parseFloat(minAmountOut);

  console.log(`[buildSwapTransactionFrontend] Amount: ${amount} ${tokenIn}`);
  console.log(`[buildSwapTransactionFrontend] MinOut: ${minOut} ${tokenOut}`);

  // Determine swap direction
  if (tokenIn === "SUI" && tokenOut === "DEEP") {
    console.log("[SDK] swapExactQuoteForBase: SUI (quote) -> DEEP (base)");
    
    const amountInMist = BigInt(Math.floor(amount * 1e9));
    const [suiCoin] = tx.splitCoins(tx.gas, [amountInMist]);
    
    const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.deepBook.swapExactQuoteForBase({
      poolKey: 'DEEP_SUI',
      amount,
      deepAmount: 0,
      minOut,
      quoteCoin: suiCoin,
    })(tx);

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
    
  } else if (tokenIn === "DEEP" && tokenOut === "SUI") {
    console.log("[SDK] swapExactBaseForQuote: DEEP (base) -> SUI (quote)");
    
    const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.deepBook.swapExactBaseForQuote({
      poolKey: 'DEEP_SUI',
      amount,
      deepAmount: 0,
      minOut,
    })(tx);

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
    
  } else if (tokenIn === "SUI" && tokenOut === "DBUSDC") {
    console.log("[SDK] swapExactBaseForQuote: SUI (base) -> DBUSDC (quote)");
    
    const amountInMist = BigInt(Math.floor(amount * 1e9));
    const [suiCoin] = tx.splitCoins(tx.gas, [amountInMist]);
    
    const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.deepBook.swapExactBaseForQuote({
      poolKey: 'SUI_DBUSDC',
      amount,
      deepAmount: 1,
      minOut,
      baseCoin: suiCoin,
    })(tx);

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
    
  } else if (tokenIn === "DBUSDC" && tokenOut === "SUI") {
    console.log("[SDK] swapExactQuoteForBase: DBUSDC (quote) -> SUI (base)");
    
    const [baseOut, quoteOut, deepOut] = deepbookClient.deepbook.deepBook.swapExactQuoteForBase({
      poolKey: 'SUI_DBUSDC',
      amount,
      deepAmount: 1,
      minOut,
    })(tx);

    tx.transferObjects([baseOut, quoteOut, deepOut], walletAddress);
    
  } else {
    throw new Error(`Unsupported swap pair: ${tokenIn} -> ${tokenOut}`);
  }

  return tx;
}

// Get Sui client
async function getSuiGrpcClient() {
  const { SuiGrpcClient } = await import('@mysten/sui/grpc');
  return new SuiGrpcClient({
    network: 'testnet',
    baseUrl: 'https://fullnode.testnet.sui.io:443',
  });
}
