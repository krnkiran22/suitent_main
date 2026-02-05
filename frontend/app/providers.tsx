"use client";

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TurnkeyProvider } from '@turnkey/react-wallet-kit';
import { TURNKEY_CONFIG } from '@/lib/turnkey/config';
import '@mysten/dapp-kit/dist/index.css';
import '@turnkey/react-wallet-kit/styles.css';

// Query client for React Query
const queryClient = new QueryClient();

// Sui network configuration
const networks = {
  testnet: { 
    url: 'https://fullnode.testnet.sui.io:443',
    network: 'testnet' as const,
  },
};

const turnkeyConfig = {
  organizationId: TURNKEY_CONFIG.organizationId,
  authProxyConfigId: TURNKEY_CONFIG.authProxyConfigId,
  wallet: {
    defaultChain: "sui" as const,
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TurnkeyProvider
        config={turnkeyConfig}
        callbacks={{
          onAuthenticationSuccess: ({ session }) => {
            console.log("[Turnkey] User authenticated:", session);
          },
          onError: (error) => {
            console.error("[Turnkey] Error:", error);
          },
        }}
      >
        <SuiClientProvider networks={networks} defaultNetwork="testnet">
          <WalletProvider autoConnect>
            {children}
          </WalletProvider>
        </SuiClientProvider>
      </TurnkeyProvider>
    </QueryClientProvider>
  );
}
