/**
 * Get the short public key from Turnkey wallet
 */
export function getTurnkeyPublicKey(wallets: any[]): string | null {
  if (!wallets || wallets.length === 0) return null;
  const account = wallets[0]?.accounts?.[0];
  return account?.publicKey || null;
}

/**
 * Get the Sui address from Turnkey wallet
 */
export function getTurnkeySuiAddress(wallets: any[]): string | null {
  if (!wallets || wallets.length === 0) return null;
  const account = wallets[0]?.accounts?.[0];
  return account?.address || null;
}

/**
 * Check if Turnkey is authenticated
 */
export function isTurnkeyAuthenticated(authState: any): boolean {
  return authState === 'Authenticated';
}
