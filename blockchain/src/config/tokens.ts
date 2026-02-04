export const TOKENS = {
  SUI: {
    symbol: "SUI",
    decimals: 9,
    coinType: "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
  },
  USDC: {
    symbol: "USDC", 
    decimals: 6,
    coinType: "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC",
  },
} as const;

export type TokenSymbol = keyof typeof TOKENS;

export function getTokenConfig(symbol: TokenSymbol) {
  return TOKENS[symbol];
}

export function isValidToken(symbol: string): symbol is TokenSymbol {
  return symbol in TOKENS;
}
