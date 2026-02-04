import { useState, useEffect } from "react";
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";

interface TokenBalance {
  coinType: string;
  symbol: string;
  name: string;
  balance: string;        // Formatted (e.g., "125.45")
  balanceRaw: string;     // Raw (e.g., "125450000000")
  decimals: number;
  iconUrl: string | null;
}

export function useWalletBalances(address: string | undefined) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setBalances([]);
      return;
    }

    async function fetchBalances() {
      setIsLoading(true);
      setError(null);

      try {
        const suiClient = new SuiJsonRpcClient({ 
          network: "testnet",
          url: getJsonRpcFullnodeUrl("testnet") 
        });

        console.log("Fetching balances for:", address);
        
        // 1. Get all coin balances
        const allBalances = await suiClient.getAllBalances({ owner: address });
        
        console.log("Got balances:", allBalances);

        if (!allBalances || allBalances.length === 0) {
          setBalances([]);
          setIsLoading(false);
          return;
        }

        // 2. Fetch metadata for each coin type
        const balancesWithMetadata: TokenBalance[] = await Promise.all(
          allBalances.map(async (bal) => {
            try {
              const metadata = await suiClient.getCoinMetadata({
                coinType: bal.coinType,
              });

              const decimals = metadata?.decimals ?? 9;
              const formattedBalance = formatBalance(bal.totalBalance, decimals);

              return {
                coinType: bal.coinType,
                symbol: metadata?.symbol ?? extractSymbol(bal.coinType),
                name: metadata?.name ?? "Unknown Token",
                balance: formattedBalance,
                balanceRaw: bal.totalBalance,
                decimals,
                iconUrl: metadata?.iconUrl ?? null,
              };
            } catch (err) {
              console.log("Error fetching metadata for", bal.coinType, err);
              // If metadata fetch fails, use defaults
              return {
                coinType: bal.coinType,
                symbol: extractSymbol(bal.coinType),
                name: "Unknown Token",
                balance: formatBalance(bal.totalBalance, 9),
                balanceRaw: bal.totalBalance,
                decimals: 9,
                iconUrl: null,
              };
            }
          })
        );

        // 3. Sort: SUI first, then by balance
        balancesWithMetadata.sort((a, b) => {
          if (a.symbol === "SUI") return -1;
          if (b.symbol === "SUI") return 1;
          return parseFloat(b.balance) - parseFloat(a.balance);
        });

        setBalances(balancesWithMetadata);
      } catch (err) {
        console.error("Error fetching balances:", err);
        setError("Failed to fetch balances");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalances();
  }, [address]);

  return { balances, isLoading, error };
}

// Helper: Format raw balance to human readable
function formatBalance(rawBalance: string, decimals: number): string {
  const balance = BigInt(rawBalance);
  const divisor = BigInt(10 ** decimals);
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;
  
  if (fractionalPart === 0n) {
    return integerPart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.slice(0, 4).replace(/0+$/, '');
  
  if (!trimmedFractional) {
    return integerPart.toString();
  }
  
  return `${integerPart}.${trimmedFractional}`;
}

// Helper: Extract symbol from coin type string
function extractSymbol(coinType: string): string {
  // coinType format: "0x...::module::SYMBOL"
  const parts = coinType.split("::");
  return parts[parts.length - 1] || "???";
}
