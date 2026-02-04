// hooks/useBalances.ts - Balance fetching hook

"use client";

import { useState, useEffect, useCallback } from "react";
import { getBalances } from "@/lib/api";

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceRaw: string;
  decimals: number;
  coinType: string;
  iconUrl: string;
}

export function useBalances(address: string | undefined) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!address) {
      console.log("[useBalances] No address, clearing balances");
      setBalances([]);
      return;
    }

    console.log("[useBalances] Fetching balances for:", address);
    setLoading(true);
    setError(null);

    try {
      const data = await getBalances(address);
      console.log("[useBalances] Balances received:", data.balances);
      setBalances(data.balances);
    } catch (err: any) {
      console.error("[useBalances] Error:", err);
      setError(err.message || "Failed to fetch balances");
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Fetch on mount and when address changes
  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    if (!address) return;

    const interval = setInterval(() => {
      console.log("[useBalances] Auto-refreshing...");
      fetchBalances();
    }, 15000);

    return () => clearInterval(interval);
  }, [address, fetchBalances]);

  return {
    balances,
    loading,
    error,
    refetch: fetchBalances,
    getBalance: (symbol: string) => balances.find((b) => b.symbol === symbol)?.balance || "0",
  };
}
