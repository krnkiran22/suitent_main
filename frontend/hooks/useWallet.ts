"use client";

import { useTurnkey as useTurnkeyBase, AuthState } from "@turnkey/react-wallet-kit";
import { getTurnkeySuiAddress, getTurnkeyPublicKey } from "@/lib/turnkey/utils";

export function useWallet() {
  const turnkey = useTurnkeyBase();
  
  const address = getTurnkeySuiAddress(turnkey.wallets);
  const publicKey = getTurnkeyPublicKey(turnkey.wallets);
  const isConnected = turnkey.authState === AuthState.Authenticated;

  return {
    ...turnkey,
    address,
    publicKey,
    isConnected,
  };
}
