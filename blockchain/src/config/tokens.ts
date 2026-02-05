export const TOKENS = {
  SUI: {
    symbol: "SUI",
    decimals: 9,
    coinType: "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
  },
  DEEP: {
    symbol: "DEEP",
    decimals: 6,
    coinType: "0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8::deep::DEEP",
  },
  DBUSDC: {
    symbol: "DBUSDC", 
    decimals: 6,
    coinType: "0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDC::DBUSDC",
  },
  DEEP: {
    symbol: "DEEP",
    decimals: 6,
    coinType: "0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8::deep::DEEP",
  },
  DBUSDT: {
    symbol: "DBUSDT",
    decimals: 6,
    coinType: "0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDT::DBUSDT",
  },
  WAL: {
    symbol: "WAL",
    decimals: 9,
    coinType: "0x9ef7676a9f81937a52ae4b2af8d511a28a0b080477c0c2db40b0ab8882240d76::wal::WAL",
  },
  DBTC: {
    symbol: "DBTC",
    decimals: 8,
    coinType: "0x6502dae813dbe5e42643c119a6450a518481f03063febc7e20238e43b6ea9e86::dbtc::DBTC",
  },
} as const;

export type TokenSymbol = keyof typeof TOKENS;

export function getTokenConfig(symbol: TokenSymbol) {
  return TOKENS[symbol];
}

export function isValidToken(symbol: string): symbol is TokenSymbol {
  return symbol in TOKENS;
}
