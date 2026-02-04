"use client";

import { formatBalance, formatUSD } from "@/lib/utils/format";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "../common/Card";

interface PortfolioSummaryProps {
  totalValue: number;
  change24h: number;
}

export function PortfolioSummary({ totalValue, change24h }: PortfolioSummaryProps) {
  const isPositive = change24h >= 0;

  return (
    <Card glass className="p-6">
      <h2 className="text-sm font-medium text-sui-mist mb-2">Total Portfolio Value</h2>
      <div className="flex items-baseline gap-4">
        <p className="text-4xl font-bold text-white">{formatUSD(totalValue)}</p>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-success' : 'text-error'}`}>
          {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          <span className="text-lg font-semibold">
            {isPositive ? '+' : ''}{change24h.toFixed(2)}%
          </span>
        </div>
      </div>
      <p className="text-xs text-sui-mist mt-2">Last 24 hours</p>
    </Card>
  );
}
