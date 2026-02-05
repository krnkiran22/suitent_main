"use client";

import { useState, useEffect } from "react";
import { useTurnkey, AuthState } from "@turnkey/react-wallet-kit";

interface TurnkeyAuthButtonProps {
  onSuccess?: () => void;
}

export function TurnkeyAuthButton({ onSuccess }: TurnkeyAuthButtonProps) {
  const { handleLogin, logout, authState, wallets } = useTurnkey();
  const [loading, setLoading] = useState(false);

  const isAuthenticated = authState === AuthState.Authenticated;

  const handleConnect = async () => {
    setLoading(true);
    try {
      console.log("[TurnkeyAuth] Initiating login...");
      await handleLogin();
      console.log("[TurnkeyAuth] Login successful!");
    } catch (error) {
      console.error("[TurnkeyAuth] Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && onSuccess) {
      onSuccess();
    }
  }, [isAuthenticated, onSuccess]);

  if (isAuthenticated) {
    const address = wallets[0]?.accounts?.[0]?.address;
    return (
      <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm">
        🔐 Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleConnect}
        disabled={loading}
        className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
      >
        {loading ? "Connecting..." : "🔐 Connect with Turnkey"}
      </button>

      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400 text-xs">
        <strong>Note:</strong> Turnkey uses passkey authentication (WebAuthn). Your browser will prompt you to create or use a passkey.
      </div>

      <div className="p-4 bg-gray-800/50 border border-gray-700 rounded text-gray-400 text-xs">
        <strong>✅ Alternative:</strong> Use browser wallets at{" "}
        <a href="/swap" className="text-blue-400 underline">/swap</a>
        {" "}(Suiet, Welldone, Sui Wallet)
      </div>
    </div>
  );
}
