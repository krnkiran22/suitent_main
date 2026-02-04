"use client";

import { formatBalance, formatUSD } from "@/lib/utils/format";

interface TokenCardProps {
  symbol: string;
  balance: string;
  usdValue: number;
  change24h: number;
}

export function TokenCard({ symbol, balance, usdValue, change24h }: TokenCardProps) {
  const isPositive = change24h >= 0;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-sui-blue/20 flex items-center justify-center">
          <span className="text-sui-blue font-bold text-sm">{symbol.slice(0, 3)}</span>
        </div>
        <div>
          <p className="text-white font-semibold">{symbol}</p>
          <p className="text-sm text-sui-mist">{formatBalance(BigInt(balance))} {symbol}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-white font-semibold">{formatUSD(usdValue)}</p>
        <p className={`text-sm ${isPositive ? 'text-success' : 'text-error'}`}>
          {isPositive ? '+' : ''}{change24h.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}
