// hooks/useDeepBookQuote.ts - Get quotes from backend API

"use client";

import { useState, useEffect, useCallback } from "react";

export interface Quote {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  estimatedAmountOut: string;
  pricePerToken: string;
  priceImpact: string;
  poolId: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export function useDeepBookQuote(
  tokenIn: string,
  tokenOut: string,
  amountIn: string
) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    // Reset if no amount
    if (!amountIn || parseFloat(amountIn) <= 0) {
      setQuote(null);
      setLoading(false);
      return;
    }

    // Only support SUI <-> DEEP for now
    const isValidPair = 
      (tokenIn === "SUI" && tokenOut === "DEEP") ||
      (tokenIn === "DEEP" && tokenOut === "SUI");

    if (!isValidPair) {
      setError("Only SUI <-> DEEP swaps are supported");
      setQuote(null);
      return;
    }

    console.log(`[DeepBookQuote] Fetching quote: ${amountIn} ${tokenIn} -> ${tokenOut}`);
    setLoading(true);
    setError(null);

    try {
      // Call backend quote endpoint
      const response = await fetch(`${BACKEND_URL}/api/price/quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenIn,
          tokenOut,
          amountIn,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch quote: ${response.status}`);
      }
      
      const quoteData = await response.json();
      console.log("[DeepBookQuote] Quote received:", quoteData);
      
      setQuote(quoteData);
      setLoading(false);
    } catch (err: any) {
      console.error("[DeepBookQuote] Error:", err);
      setError(err?.message || "Failed to fetch quote");
      setLoading(false);
      setQuote(null);
    }
  }, [tokenIn, tokenOut, amountIn]);

  // Fetch quote when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchQuote();
    }, 500); // Debounce by 500ms

    return () => clearTimeout(timeoutId);
  }, [fetchQuote]);

  return {
    quote,
    loading,
    error,
    refetch: fetchQuote,
  };
}
