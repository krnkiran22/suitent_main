export const SUI_DECIMALS = 9;
export const MIST_PER_SUI = BigInt(10 ** SUI_DECIMALS);

export const APP_NAME = "SuiTent";
export const APP_DESCRIPTION = "Intent-Based Trading on Sui";

export const DEFAULT_GAS_BUDGET = 5_000_000n;

export const ROUTES = {
  HOME: "/",
  CHAT: "/chat",
  PORTFOLIO: "/portfolio",
  ORDERS: "/orders",
  HISTORY: "/history",
  SETTINGS: "/settings",
} as const;
