"use client";

import {
  TurnkeyProvider,
  TurnkeyProviderConfig,
  CreateSubOrgParams,
} from "@turnkey/react-wallet-kit";
import "@turnkey/react-wallet-kit/styles.css";

// Sui wallet configuration
const suiWalletParams: CreateSubOrgParams = {
  userName: `SuiTent-User-${Date.now()}`,
  customWallet: {
    walletName: "Sui Wallet",
    walletAccounts: [
      {
        curve: "CURVE_ED25519",           // Sui uses Ed25519
        pathFormat: "PATH_FORMAT_BIP32",
        path: "m/44'/784'/0'/0'/0'",      // 784 = Sui coin type
        addressFormat: "ADDRESS_FORMAT_SUI", // This gives you 64-char Sui address!
      },
    ],
  },
};

const turnkeyConfig: TurnkeyProviderConfig = {
  organizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID!,
  authProxyConfigId: process.env.NEXT_PUBLIC_AUTH_PROXY_CONFIG_ID!,
  auth: {
    createSuborgParams: {
      // Apply Sui wallet config to ALL auth methods
      emailOtpAuth: suiWalletParams,
      smsOtpAuth: suiWalletParams,
      passkeyAuth: { ...suiWalletParams, passkeyName: "SuiTent Passkey" },
      oauth: suiWalletParams,
    },
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TurnkeyProvider
      config={turnkeyConfig}
      callbacks={{
        onAuthenticationSuccess: ({ session }) => {
          console.log("User authenticated:", session);
        },
        onError: (error) => {
          console.error("Turnkey error:", error);
        },
      }}
    >
      {children}
    </TurnkeyProvider>
  );
}
