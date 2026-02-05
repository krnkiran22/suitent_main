"use client";

import { useState, useCallback } from "react";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import { Ed25519PublicKey } from "@mysten/sui/keypairs/ed25519";
import { messageWithIntent } from "@mysten/sui/cryptography";
import { blake2b } from "@noble/hashes/blake2b";
import { bytesToHex } from "@noble/hashes/utils";
import { getSwapQuote, buildSwapTransaction } from "@/lib/api";

const suiClient = new SuiJsonRpcClient({ 
  network: "testnet",
  url: getJsonRpcFullnodeUrl("testnet") 
});

export interface SwapQuote {
  tokenIn: { symbol: string; amount: string; amountRaw: string };
  tokenOut: {
    symbol: string;
    estimatedAmount: string;
    estimatedAmountRaw: string;
    minAmount: string;
    minAmountRaw: string;
  };
  exchangeRate: string;
  priceImpact: string;
  networkFee: string;
}

export function useSwap() {
  const turnkeyHook = useTurnkey();
  const { wallets } = turnkeyHook;
  
  // Log what's available
  console.log("[useSwap] Turnkey hook keys:", Object.keys(turnkeyHook));
  
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const walletAddress = wallets?.[0]?.accounts?.[0]?.address;
  const walletPublicKey = wallets?.[0]?.accounts?.[0]?.publicKey;
  
  // Try to get turnkey client from different possible properties
  const turnkeyClient = (turnkeyHook as any).client || 
                        (turnkeyHook as any).passkeyClient || 
                        (turnkeyHook as any).turnkeyClient;

  console.log("[useSwap] Hook initialized, wallet:", walletAddress);
  console.log("[useSwap] Turnkey client available:", !!turnkeyClient);

  // Fetch quote from backend
  const fetchQuote = useCallback(
    async (tokenIn: string, tokenOut: string, amountIn: string) => {
      console.log(`[useSwap] fetchQuote: ${amountIn} ${tokenIn} -> ${tokenOut}`);

      if (!amountIn || parseFloat(amountIn) <= 0) {
        console.log("[useSwap] Invalid amount, clearing quote");
        setQuote(null);
        return;
      }

      setQuoteLoading(true);
      setError(null);

      try {
        const quoteData = await getSwapQuote(tokenIn, tokenOut, amountIn);
        console.log("[useSwap] Quote received:", quoteData);
        
        // Format the quote to match expected structure
        const formattedQuote: SwapQuote = {
          tokenIn: {
            symbol: tokenIn,
            amount: amountIn,
            amountRaw: quoteData.amountInRaw,
          },
          tokenOut: {
            symbol: tokenOut,
            estimatedAmount: quoteData.estimatedAmountOut,
            estimatedAmountRaw: quoteData.estimatedAmountOutRaw,
            minAmount: (parseFloat(quoteData.estimatedAmountOut) * 0.99).toFixed(6),
            minAmountRaw: quoteData.estimatedAmountOutRaw,
          },
          exchangeRate: quoteData.pricePerToken,
          priceImpact: quoteData.priceImpact,
          networkFee: "0.005",
        };
        
        setQuote(formattedQuote);
      } catch (err: any) {
        console.error("[useSwap] Quote error:", err);
        setError(err.message || "Failed to get quote");
        setQuote(null);
      } finally {
        setQuoteLoading(false);
      }
    },
    []
  );

  // Execute swap
  const executeSwap = useCallback(
    async (tokenIn: string, tokenOut: string, amountIn: string, slippage: number = 0.01) => {
      console.log("[useSwap] executeSwap called");
      console.log(`[useSwap] Params: ${amountIn} ${tokenIn} -> ${tokenOut}, slippage: ${slippage}`);

      if (!walletAddress) {
        const error = "Wallet not connected";
        console.error("[useSwap]", error);
        setError(error);
        return null;
      }

      setLoading(true);
      setError(null);
      setTxDigest(null);

      try {
        // Step 1: Get quote to calculate minAmountOut
        console.log("[useSwap] Step 1: Getting quote for minAmountOut...");
        const quoteData = await getSwapQuote(tokenIn, tokenOut, amountIn);
        const minAmountOut = (parseFloat(quoteData.estimatedAmountOut) * (1 - slippage)).toFixed(6);
        console.log("[useSwap] Min amount out with slippage:", minAmountOut);
        
        // Step 2: Build transaction from backend
        console.log("[useSwap] Step 2: Building transaction...");
        const { transaction, quote: txQuote } = await buildSwapTransaction(
          walletAddress,
          tokenIn,
          tokenOut,
          amountIn,
          minAmountOut
        );
        console.log("[useSwap] Transaction built:", transaction);

        // Step 3: Sign with Turnkey using low-level API
        console.log("[useSwap] Step 3: Signing with Turnkey...");
        
        // Get the Turnkey HTTP client for low-level signing
        const client = (turnkeyHook as any).httpClient;
        
        if (!client) {
          console.error("[useSwap] httpClient not available");
          throw new Error("Turnkey HTTP client not available. Make sure you're authenticated.");
        }
        
        if (!walletPublicKey) {
          throw new Error("Wallet public key not available");
        }
        
        // Decode base64 transaction bytes
        const txBytes = Uint8Array.from(atob(transaction.txBytes), (c) => c.charCodeAt(0));
        console.log("[useSwap] Transaction bytes length:", txBytes.length);
        
        // Create the transaction digest for signing
        const intentMsg = messageWithIntent('TransactionData', txBytes);
        const digest = blake2b(intentMsg, { dkLen: 32 });
        const digestHex = bytesToHex(digest);
        
        console.log("[useSwap] Transaction digest:", digestHex.substring(0, 64) + "...");
        
        // Sign with Turnkey's low-level API
        let signResult;
        try {
          console.log("[useSwap] Calling Turnkey signRawPayload...");
          signResult = await client.signRawPayload({
            signWith: walletAddress,
            payload: digestHex,
            encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
            hashFunction: "HASH_FUNCTION_NOT_APPLICABLE",
          });
          console.log("[useSwap] Transaction signed successfully");
        } catch (signError: any) {
          console.error("[useSwap] Signing error:", signError);
          throw new Error(`Failed to sign transaction: ${signError.message || 'Unknown error'}`);
        }
        
        // Serialize the signature for Sui
        const signatureBytes = Buffer.from(signResult.r + signResult.s, 'hex');
        const publicKey = new Ed25519PublicKey(Buffer.from(walletPublicKey, 'hex'));
        
        // Sui signature format: [scheme byte (0x00 for Ed25519)] + [signature] + [public key]
        const scheme = new Uint8Array([0x00]); // ED25519 flag
        const pubKeyBytes = publicKey.toRawBytes();
        const serializedSignature = new Uint8Array(
          scheme.length + signatureBytes.length + pubKeyBytes.length
        );
        serializedSignature.set(scheme, 0);
        serializedSignature.set(signatureBytes, scheme.length);
        serializedSignature.set(pubKeyBytes, scheme.length + signatureBytes.length);
        
        const signature = Buffer.from(serializedSignature).toString('base64');
        console.log("[useSwap] Serialized signature:", signature.substring(0, 50) + "...");

        // Step 4: Execute on Sui network
        console.log("[useSwap] Step 4: Executing on Sui network...");
        const result = await suiClient.executeTransactionBlock({
          transactionBlock: transaction.txBytes, // Use original base64 bytes
          signature: signature,
          options: {
            showEffects: true,
            showBalanceChanges: true,
          },
        });

        console.log("[useSwap] Transaction executed!");
        console.log("[useSwap] Digest:", result.digest);
        console.log("[useSwap] Status:", result.effects?.status);
        console.log("[useSwap] Balance changes:", result.balanceChanges);

        setTxDigest(result.digest);

        if (result.effects?.status?.status === "failure") {
          throw new Error(result.effects.status.error || "Transaction failed");
        }

        return result;
      } catch (err: any) {
        console.error("[useSwap] Swap failed:", err);
        setError(err.message || "Swap failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, walletPublicKey, turnkeyHook, quote]
  );

  // Clear state
  const reset = useCallback(() => {
    console.log("[useSwap] Resetting state");
    setQuote(null);
    setError(null);
    setTxDigest(null);
  }, []);

  return {
    // State
    quote,
    loading,
    quoteLoading,
    error,
    txDigest,
    walletAddress,

    // Actions
    fetchQuote,
    executeSwap,
    reset,
  };
}
