// components/swap/SwapCard.tsx - Main swap component

"use client";

import { useState, useEffect, useCallback } from "react";
import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { useUniversalSwap } from "@/hooks/useUniversalSwap";
import { useBalances } from "@/hooks/useBalances";
import { useWebSocketQuote } from "@/hooks/useWebSocketQuote";
import { getAllTokens, Token } from "@/lib/tokens";
import { TokenSelector } from "./TokenSelector";
import { UnifiedConnectButton } from "../wallet/UnifiedConnectButton";

export function SwapCard() {
  // Get all tokens safely
  const allTokens = getAllTokens();
  
  // Form state
  const [tokenIn, setTokenIn] = useState<Token>(allTokens[0]); // SUI
  const [tokenOut, setTokenOut] = useState<Token>(allTokens[1]); // DEEP (was USDC/DBUSDC)
  const [amountIn, setAmountIn] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Real-time quote via WebSocket
  const {
    quote: wsQuote,
    loading: wsLoading,
    error: wsError,
    connected: wsConnected,
  } = useWebSocketQuote(tokenIn.symbol, tokenOut.symbol, amountIn);

  // Swap execution hook (supports both wallet types)
  const {
    loading,
    error: swapError,
    txDigest,
    executeSwap,
    reset,
    walletType,
  } = useUniversalSwap();

  // Get wallet address from hook
  const standardAccount = useCurrentAccount();
  const { wallets: turnkeyWallets } = useTurnkey();
  const turnkeyAddress = turnkeyWallets?.[0]?.accounts?.[0]?.address;
  const walletAddress = standardAccount?.address || turnkeyAddress;
  const isConnected = !!walletAddress;

  // Balances
  const { balances, getBalance, refetch: refetchBalances } = useBalances(walletAddress);

  console.log("[SwapCard] Render - Connected:", isConnected, "Address:", walletAddress);
  console.log("[SwapCard] WebSocket:", wsConnected ? "Connected" : "Disconnected", "Quote:", wsQuote?.estimatedAmountOut);

  // Handle swap direction toggle
  const handleSwapDirection = useCallback(() => {
    console.log("[SwapCard] Swapping direction");
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn("");
    reset();
  }, [tokenIn, tokenOut, reset]);

  // Handle max button
  const handleMax = useCallback(() => {
    const balance = getBalance(tokenIn.symbol);
    console.log("[SwapCard] Setting max:", balance);
    // Leave a little for gas if SUI
    if (tokenIn.symbol === "SUI" && parseFloat(balance) > 0.01) {
      setAmountIn((parseFloat(balance) - 0.01).toFixed(4));
    } else {
      setAmountIn(balance);
    }
  }, [tokenIn.symbol, getBalance]);

  // Handle swap execution
  const handleSwap = async () => {
    console.log("[SwapCard] Executing swap...");
    const result = await executeSwap(tokenIn.symbol, tokenOut.symbol, amountIn);

    if (result) {
      console.log("[SwapCard] Swap successful!");
      setShowSuccess(true);
      setAmountIn("");
      refetchBalances();
    }
  };

  // Determine button state
  const getButtonState = () => {
    if (!isConnected) {
      return { text: "Connect Wallet", disabled: false, action: () => {} };
    }
    if (!amountIn || parseFloat(amountIn) <= 0) return { text: "Enter Amount", disabled: true };
    
    const balance = parseFloat(getBalance(tokenIn.symbol));
    const amount = parseFloat(amountIn);
    
    console.log(`[SwapCard] Balance check: ${balance} ${tokenIn.symbol}, trying to swap: ${amount}`);
    
    if (amount > balance) {
      return { text: `Insufficient ${tokenIn.symbol} Balance`, disabled: true };
    }
    if (wsLoading) return { text: "Getting Quote...", disabled: true };
    if (loading) return { text: "Swapping...", disabled: true };
    return { text: "Swap", disabled: false, action: handleSwap };
  };

  const buttonState = getButtonState();
  const displayError = wsError || swapError;

  return (
    <div className="swap-card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Swap</h2>
          {isConnected && (
            <p className="text-xs text-gray-500 mt-1">
              {walletType === 'standard' ? '🌊 Browser Wallet' : '🔐 Turnkey Wallet'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isConnected && walletType && (
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-400">
              {walletType === 'standard' ? '🌊 Browser Wallet' : '🔐 Turnkey'}
            </div>
          )}
          {wsConnected && (
            <div className="flex items-center gap-2 text-xs text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Live
            </div>
          )}
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
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            placeholder="0.0"
            className="amount-input"
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button onClick={handleSwapDirection} className="swap-direction-btn">
          ⇅
        </button>
      </div>

      {/* Token Out */}
      <div className="token-input-container">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>You Receive</span>
          <span>Balance: {getBalance(tokenOut.symbol)} {tokenOut.symbol}</span>
        </div>
        <div className="flex items-center gap-4">
          <TokenSelector
            selectedToken={tokenOut}
            onSelectToken={setTokenOut}
            excludeToken={tokenIn}
          />
          <input
            type="text"
            value={wsQuote?.estimatedAmountOut || ""}
            placeholder="0.0"
            disabled
            className="amount-input text-gray-300"
          />
        </div>
      </div>

      {/* Quote Details */}
      {wsQuote && amountIn && parseFloat(amountIn) > 0 && (
        <div className="swap-details">
          <div className="swap-details-row">
            <span>Price Impact</span>
            <span className={parseFloat(wsQuote.priceImpact) > 1 ? "text-red-400" : ""}>{wsQuote.priceImpact}%</span>
          </div>
          <div className="swap-details-row">
            <span>Min. Received (1% slippage)</span>
            <span>{(parseFloat(wsQuote.estimatedAmountOut) * 0.99).toFixed(6)} {tokenOut.symbol}</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {displayError && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {displayError}
        </div>
      )}

      {/* Swap Button / Connect Button */}
      {!isConnected ? (
        // Unified connect button (Browser + Turnkey)
        <div className="mt-6">
          <UnifiedConnectButton />
        </div>
      ) : (
        // Swap button (when connected)
        <button
          onClick={buttonState.action}
          disabled={buttonState.disabled}
          className="swap-btn"
        >
          {loading && <span className="mr-2">⏳</span>}
          {buttonState.text}
        </button>
      )}

      {/* Success Message */}
      {showSuccess && txDigest && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="text-green-400 font-medium mb-2">✅ Swap Successful!</div>
          <a
            href={`https://suiscan.xyz/testnet/tx/${txDigest}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline text-sm break-all"
          >
            View on Explorer: {txDigest}
          </a>
          <button
            onClick={() => setShowSuccess(false)}
            className="mt-2 text-gray-400 text-sm hover:text-white block"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
