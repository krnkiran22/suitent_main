"use client";

import { TokenCard } from "./TokenCard";
import { Card } from "../common/Card";
import { Loader } from "../common/Loader";

interface Token {
  symbol: string;
  balance: string;
  usdValue: number;
  change24h: number;
}

interface TokenListProps {
  tokens: Token[];
  loading?: boolean;
}

export function TokenList({ tokens, loading }: TokenListProps) {
  if (loading) {
    return (
      <Card glass className="p-12 flex items-center justify-center">
        <Loader size="lg" />
      </Card>
    );
  }

  if (tokens.length === 0) {
    return (
      <Card glass className="p-12 text-center">
        <p className="text-sui-mist">No tokens found</p>
      </Card>
    );
  }

  return (
    <Card glass className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Your Tokens</h3>
      <div className="space-y-3">
        {tokens.map((token, index) => (
          <TokenCard key={index} {...token} />
        ))}
      </div>
    </Card>
  );
}
