// lib/tokens.ts - Token configuration (same as backend)

export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  coinType: string;
  iconUrl: string;
}

export const TOKENS: Record<string, Token> = {
  SUI: {
    symbol: "SUI",
    name: "Sui",
    decimals: 9,
    coinType: "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
    iconUrl: "https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    coinType: "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC",
    iconUrl: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
  },
};

export function getToken(symbol: string): Token | undefined {
  return TOKENS[symbol.toUpperCase()];
}

export function getAllTokens(): Token[] {
  return Object.values(TOKENS);
}
