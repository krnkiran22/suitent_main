export const TURNKEY_CONFIG = {
  organizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID!,
  authProxyConfigId: process.env.NEXT_PUBLIC_AUTH_PROXY_CONFIG_ID!,
  network: process.env.NEXT_PUBLIC_SUI_NETWORK as "mainnet" | "testnet" | "devnet" || "testnet",
};

export const TURNKEY_WALLET_CONFIG = {
  defaultChain: "sui",
  addressType: "ADDRESS_TYPE_SUI",
};
