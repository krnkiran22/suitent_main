// lib/tokens.ts - Token configuration

export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  coinType: string;
  iconUrl: string;
}

// Base tokens available on DeepBook testnet
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
    coinType: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
    iconUrl: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
  },
  DBUSDC: {
    symbol: "DBUSDC",
    name: "Deepbook USDC",
    decimals: 6,
    coinType: "0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDC::DBUSDC",
    iconUrl: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
  },
  DEEP: {
    symbol: "DEEP",
    name: "Deepbook Token",
    decimals: 6,
    coinType: "0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8::deep::DEEP",
    iconUrl: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
  },
  DBUSDT: {
    symbol: "DBUSDT",
    name: "Deepbook USDT",
    decimals: 6,
    coinType: "0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDT::DBUSDT",
    iconUrl: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  },
  WAL: {
    symbol: "WAL",
    name: "Walrus",
    decimals: 9,
    coinType: "0x9ef7676a9f81937a52ae4b2af8d511a28a0b080477c0c2db40b0ab8882240d76::wal::WAL",
    iconUrl: "https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg",
  },
  DBTC: {
    symbol: "DBTC",
    name: "Deepbook BTC",
    decimals: 8,
    coinType: "0x6502dae813dbe5e42643c119a6450a518481f03063febc7e20238e43b6ea9e86::dbtc::DBTC",
    iconUrl: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
  },
};

export function getToken(symbol: string): Token | undefined {
  return TOKENS[symbol.toUpperCase()];
}

export function getAllTokens(): Token[] {
  return Object.values(TOKENS);
}
