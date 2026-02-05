"use client";

import { useState, useCallback, useEffect } from "react";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { useTurnkeySwap } from "@/hooks/useTurnkeySwap";
import { useBalances } from "@/hooks/useBalances";
import { getAllTokens, Token } from "@/lib/tokens";
import { TokenSelector } from "./TokenSelector";
import { TurnkeyAuthButton } from "../wallet/TurnkeyAuthButton";

export function TurnkeySwapCard() {
  const { wallets } = useTurnkey();
  const walletAddress = wallets?.[0]?.accounts?.[0]?.address;
  const isConnected = !!walletAddress;

  // Get all tokens safely
  const allTokens = getAllTokens();
  
  // Form state
  const [tokenIn, setTokenIn] = useState<Token>(allTokens[0]); // SUI
  const [tokenOut, setTokenOut] = useState<Token>(allTokens[1]); // DEEP
  const [amountIn, setAmountIn] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Swap execution with Turnkey
  const {
    loading,
    error: swapError,
    txDigest,
    executeSwap,
    reset,
  } = useTurnkeySwap();

  // Balances
  const { balances, getBalance, refetch: refetchBalances } = useBalances(walletAddress);

  console.log("[TurnkeySwapCard] Connected:", isConnected, "Address:", walletAddress);

  // Handle swap direction toggle
  const handleSwapDirection = useCallback(() => {
    console.log("[TurnkeySwapCard] Swapping direction");
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn("");
    reset();
  }, [tokenIn, tokenOut, reset]);

  // Handle max button
  const handleMax = useCallback(() => {
    const balance = getBalance(tokenIn.symbol);
    console.log("[TurnkeySwapCard] Setting max:", balance);
    if (tokenIn.symbol === "SUI" && parseFloat(balance) > 0.01) {
      setAmountIn((parseFloat(balance) - 0.01).toFixed(4));
    } else {
      setAmountIn(balance);
    }
  }, [tokenIn.symbol, getBalance]);

  // Handle swap execution
  const handleSwap = async () => {
    console.log("[TurnkeySwapCard] Executing swap...");
    const result = await executeSwap(tokenIn.symbol, tokenOut.symbol, amountIn);

    if (result) {
      console.log("[TurnkeySwapCard] Swap successful!");
      setShowSuccess(true);
      setAmountIn("");
      refetchBalances();
    }
  };

  // Determine button state (only for when connected)
  const getButtonState = () => {
    if (!amountIn || parseFloat(amountIn) <= 0) return { text: "Enter Amount", disabled: true };
    
    const balance = parseFloat(getBalance(tokenIn.symbol));
    const amount = parseFloat(amountIn);
    
    if (amount > balance) {
      return { text: `Insufficient ${tokenIn.symbol} Balance`, disabled: true };
    }
    if (loading) return { text: "Swapping...", disabled: true };
    return { text: "Swap", disabled: false, action: handleSwap };
  };

  const buttonState = isConnected ? getButtonState() : { text: "Connect Turnkey", disabled: true };

  return (
    <div className="swap-card">
      {!isConnected ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Swap with Turnkey</h2>
            <p className="text-sm text-gray-400">
              Secure trading with passkey authentication
            </p>
          </div>
          <TurnkeyAuthButton />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Swap with Turnkey</h2>
              <p className="text-xs text-gray-500 mt-1">
                🔐 Turnkey Wallet
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs font-semibold text-purple-400">
                🔐 Connected
              </div>
            </div>
          </div>

      {/* Token In */}
      <div className="token-input-container">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>You Pay</span>
          <span>
            Balance: {getBalance(tokenIn.symbol)} {tokenIn.symbol}
            <button onClick={handleMax} className="ml-2 text-cyan-400 hover:text-cyan-300">
              MAX
            </button>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <TokenSelector
            selectedToken={tokenIn}
            onSelectToken={setTokenIn}
            excludeToken={tokenOut}
          />
          <input
            type="number"
            placeholder="0.0"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            className="flex-1 bg-transparent text-2xl font-bold outline-none"
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-2">
        <button
          onClick={handleSwapDirection}
          className="swap-direction-button"
        >
          ↓
        </button>
      </div>

      {/* Token Out */}
      <div className="token-input-container">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>You Receive</span>
          <span>
            Balance: {getBalance(tokenOut.symbol)} {tokenOut.symbol}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <TokenSelector
            selectedToken={tokenOut}
            onSelectToken={setTokenOut}
            excludeToken={tokenIn}
          />
          <div className="flex-1 text-2xl font-bold text-gray-400">
            ~
          </div>
        </div>
      </div>

      {/* Error Display */}
      {swapError && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {swapError}
        </div>
      )}

      {/* Success Display */}
      {showSuccess && txDigest && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
          Swap successful!{" "}
          <a
            href={`https://suiscan.xyz/testnet/tx/${txDigest}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View Transaction
          </a>
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={buttonState.action}
        disabled={buttonState.disabled}
        className={`swap-button ${buttonState.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {buttonState.text}
      </button>

      {/* Connected Wallet Info */}
      {isConnected && walletAddress && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
      )}
        </>
      )}
    </div>
  );
}
