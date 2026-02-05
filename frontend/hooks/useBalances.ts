// hooks/useBalances.ts - Balance fetching hook

"use client";

import { useState, useEffect, useCallback } from "react";
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";

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

    // Normalize address to full 66-char Sui format (0x + 64 hex chars)
    let normalizedAddress = address;
    if (address.startsWith('0x')) {
      const hexPart = address.slice(2);
      if (hexPart.length < 64) {
        // Pad with leading zeros
        normalizedAddress = '0x' + hexPart.padStart(64, '0');
        console.log("[useBalances] Normalized address from", address, "to", normalizedAddress);
      }
    }

    console.log("[useBalances] Fetching balances for:", normalizedAddress);
    setLoading(true);
    setError(null);

    try {
      const suiClient = new SuiJsonRpcClient({ 
        network: "testnet",
        url: getJsonRpcFullnodeUrl("testnet") 
      });

      // Fetch all coin balances directly from Sui RPC
      console.log("[useBalances] Calling getAllBalances for address:", normalizedAddress);
      const allBalances = await suiClient.getAllBalances({ owner: normalizedAddress });
      
      console.log("[useBalances] Raw balances:", allBalances);
      console.log("[useBalances] Number of balances:", allBalances?.length);

      if (!allBalances || allBalances.length === 0) {
        console.log("[useBalances] No balances found");
        setBalances([]);
        setLoading(false);
        return;
      }

      // Fetch metadata for each coin type
      const balancesWithMetadata: TokenBalance[] = await Promise.all(
        allBalances.map(async (bal) => {
          try {
            const metadata = await suiClient.getCoinMetadata({ coinType: bal.coinType });
            
            const decimals = metadata?.decimals ?? 9;
            const rawBalance = BigInt(bal.totalBalance);
            const divisor = BigInt(10 ** decimals);
            const formattedBalance = (Number(rawBalance) / Number(divisor)).toFixed(4);

            return {
              coinType: bal.coinType,
              symbol: metadata?.symbol ?? extractSymbol(bal.coinType),
              name: metadata?.name ?? "Unknown Token",
              balance: formattedBalance,
              balanceRaw: bal.totalBalance,
              decimals,
              iconUrl: metadata?.iconUrl ?? "",
            };
          } catch (err) {
            console.log("[useBalances] Error fetching metadata for", bal.coinType, err);
            const decimals = 9;
            const rawBalance = BigInt(bal.totalBalance);
            const divisor = BigInt(10 ** decimals);
            const formattedBalance = (Number(rawBalance) / Number(divisor)).toFixed(4);
            
            return {
              coinType: bal.coinType,
              symbol: extractSymbol(bal.coinType),
              name: "Unknown Token",
              balance: formattedBalance,
              balanceRaw: bal.totalBalance,
              decimals,
              iconUrl: "",
            };
          }
        })
      );

      // Sort: SUI first, then by balance
      balancesWithMetadata.sort((a, b) => {
        if (a.symbol === "SUI") return -1;
        if (b.symbol === "SUI") return 1;
        return parseFloat(b.balance) - parseFloat(a.balance);
      });

      console.log("[useBalances] Balances with metadata:", balancesWithMetadata);
      setBalances(balancesWithMetadata);
    } catch (err: any) {
      console.error("[useBalances] Error:", err);
      console.error("[useBalances] Error message:", err?.message);
      console.error("[useBalances] Error stack:", err?.stack);
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
    getBalance: (symbol: string) => {
      const balance = balances.find((b) => b.symbol === symbol)?.balance || "0.00";
      console.log(`[useBalances] getBalance(${symbol}) = ${balance}`);
      return balance;
    },
  };
}

// Helper to extract symbol from coin type
function extractSymbol(coinType: string): string {
  // Example: "0x2::sui::SUI" -> "SUI"
  const parts = coinType.split("::");
  return parts[parts.length - 1]?.toUpperCase() || "UNKNOWN";
}
