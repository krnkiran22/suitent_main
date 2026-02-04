"use client";

import { useState, useEffect } from "react";
import { useWallet } from "./useWallet";
import { getAllBalances } from "@/lib/sui/queries";

export interface TokenBalance {
  coinType: string;
  balance: string;
  totalBalance: string;
}

export function usePortfolio() {
  const { address, isConnected } = useWallet();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !isConnected) {
      setBalances([]);
      return;
    }

    const fetchBalances = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getAllBalances(address);
        // Map CoinBalance to TokenBalance
        const mappedBalances: TokenBalance[] = data.map((coin) => ({
          coinType: coin.coinType,
          balance: coin.totalBalance,
          totalBalance: coin.totalBalance,
        }));
        setBalances(mappedBalances);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch balances");
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, [address, isConnected]);

  return {
    balances,
    loading,
    error,
  };
}
