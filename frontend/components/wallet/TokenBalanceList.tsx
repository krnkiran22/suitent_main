import { useWalletBalances } from "@/hooks/useWalletBalances";
import { TokenBalanceItem } from "./TokenBalanceItem";

interface TokenBalanceListProps {
  address: string;
}

export function TokenBalanceList({ address }: TokenBalanceListProps) {
  const { balances, isLoading, error } = useWalletBalances(address);

  console.log('[TokenBalanceList] address:', address);
  console.log('[TokenBalanceList] balances:', balances);
  console.log('[TokenBalanceList] isLoading:', isLoading);
  console.log('[TokenBalanceList] error:', error);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        Failed to load balances
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No tokens found
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {balances.map((token) => (
        <TokenBalanceItem
          key={token.coinType}
          coinType={token.coinType}
          symbol={token.symbol}
          name={token.name}
          balance={token.balance}
          iconUrl={token.iconUrl}
        />
      ))}
    </div>
  );
}
