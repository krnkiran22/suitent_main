// hooks/useSwap.ts - Swap hook with full logging

"use client";

import { useState, useCallback } from "react";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
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
  const { wallets, signTransaction } = useTurnkey();
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const walletAddress = wallets?.[0]?.accounts?.[0]?.address;

  console.log("[useSwap] Hook initialized, wallet:", walletAddress);

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

        // Step 3: Sign with Turnkey
        console.log("[useSwap] Step 3: Signing with Turnkey...");
        
        // Decode base64 to Uint8Array for signing
        const txBytes = Uint8Array.from(atob(transaction.txBytes), (c) => c.charCodeAt(0));
        console.log("[useSwap] Transaction bytes length:", txBytes.length);

        // Sign the transaction
        const { signature, transactionBlockBytes } = await signTransaction({
          transaction: txBytes,
        });
        console.log("[useSwap] Transaction signed, signature:", signature?.substring(0, 50) + "...");

        // Step 4: Execute on Sui network
        console.log("[useSwap] Step 4: Executing on Sui network...");
        const result = await suiClient.executeTransactionBlock({
          transactionBlock: transactionBlockBytes || transaction.txBytes,
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
    [walletAddress, signTransaction, quote]
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
