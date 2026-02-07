"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { ArrowDown } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { useUniversalSwap } from "@/hooks/useUniversalSwap";
import { useBalances } from "@/hooks/useBalances";
import { useDeepBookQuote } from "@/hooks/useDeepBookQuote";
import { getAllTokens, Token } from "@/lib/tokens";
import { TokenSelector } from "@/components/swap/TokenSelector";
import { TransactionLimitModal } from "@/components/wallet/TransactionLimitModal";
import { useUniswapSwap, UNISWAP_TOKENS } from "@/hooks/useUniswapSwap";
import UniswapAnalytics from "@/components/swap/UniswapAnalytics";
import { useUniswapV4Hooks } from "@/hooks/useUniswapV4Hooks";
import V4HooksSelector from "@/components/swap/V4HooksSelector";
import { TradingChart } from "@/components/chart/TradingChart";

export default function SwapPage() {
  // Get all tokens
  const allTokens = getAllTokens();
  
  // Form state
  const [tokenIn, setTokenIn] = useState<Token>(allTokens[0]); // SUI
  const [tokenOut, setTokenOut] = useState<Token>(allTokens[1]); // DEEP
  const [amountIn, setAmountIn] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Swap execution hook (supports both wallet types)
  const {
    loading,
    error: swapError,
    txDigest,
    executeSwap,
    reset,
    walletType,
  } = useUniversalSwap();

  // Uniswap integration for enhanced liquidity routing
  const {
    getQuote: getUniswapQuote,
    executeSwap: executeUniswapSwap,
    quote: uniswapQuote,
    loading: uniswapLoading,
    isServiceReady: isUniswapReady,
    reset: resetUniswap
  } = useUniswapSwap();

  // Uniswap V4 Hooks for advanced DeFi functionality
  const {
    getV4Quote,
    executeV4Swap,
    availableHooks,
    selectedHook,
    switchHook,
    isServiceReady: isV4Ready,
    quote: v4Quote,
    loading: v4Loading
  } = useUniswapV4Hooks();

  // Get wallet address from hook
  const standardAccount = useCurrentAccount();
  const { wallets: turnkeyWallets } = useTurnkey();
  const turnkeyAddress = turnkeyWallets?.[0]?.accounts?.[0]?.address;
  const walletAddress = standardAccount?.address || turnkeyAddress;
  const isConnected = !!walletAddress;

  // Balances
  const { balances, getBalance, refetch: refetchBalances } = useBalances(walletAddress);

  console.log('[SwapPage] walletAddress:', walletAddress);
  console.log('[SwapPage] balances:', balances);
  console.log('[SwapPage] tokenIn balance:', getBalance(tokenIn.symbol));
  console.log('[SwapPage] tokenOut balance:', getBalance(tokenOut.symbol));

  // Real-time quote from DeepBook
  const {
    quote,
    loading: quoteLoading,
    error: quoteError,
  } = useDeepBookQuote(tokenIn.symbol, tokenOut.symbol, amountIn);

  // Handle swap direction toggle
  const handleSwapDirection = useCallback(() => {
    const tempToken = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(tempToken);
    // Keep the amount - quote will update automatically
    reset();
  }, [tokenIn, tokenOut, reset]);

  // Handle max button
  const handleMax = useCallback(() => {
    const balance = getBalance(tokenIn.symbol);
    if (tokenIn.symbol === "SUI" && parseFloat(balance) > 0.01) {
      setAmountIn((parseFloat(balance) - 0.01).toFixed(4));
    } else {
      setAmountIn(balance);
    }
  }, [tokenIn.symbol, getBalance]);

  // Handle swap execution with Uniswap fallback
  const handleSwap = async () => {
    // Show transaction limit modal for Turnkey wallets (simulating limit)
    if (walletType === 'turnkey') {
      setShowLimitModal(true);
      return;
    }
    
    try {
      // Primary swap execution through SuiTent's native system
      const result = await executeSwap(tokenIn.symbol, tokenOut.symbol, amountIn);
      
      if (result) {
        setShowSuccess(true);
        setAmountIn("");
        refetchBalances();
        setTimeout(() => setShowSuccess(false), 5000);
      } else if (isUniswapReady) {
        // Fallback to Uniswap for enhanced liquidity (demonstration purposes)
        console.log('🔄 Attempting Uniswap fallback for enhanced liquidity...');
        
        const uniswapTokenMap = {
          'USDC': UNISWAP_TOKENS.USDC,
          'USDT': UNISWAP_TOKENS.USDT,
          'ETH': UNISWAP_TOKENS.WETH,
          'WBTC': UNISWAP_TOKENS.WBTC,
          'DAI': UNISWAP_TOKENS.DAI
        };
        
        const tokenInAddress = uniswapTokenMap[tokenIn.symbol as keyof typeof uniswapTokenMap];
        const tokenOutAddress = uniswapTokenMap[tokenOut.symbol as keyof typeof uniswapTokenMap];
        
        if (tokenInAddress && tokenOutAddress) {
          // First try V4 hooks for advanced functionality
          if (isV4Ready && selectedHook) {
            console.log('🎣 Attempting Uniswap V4 hooks integration...');
            const v4Result = await executeV4Swap(
              tokenIn.symbol, 
              tokenOut.symbol, 
              amountIn, 
              selectedHook, 
              walletAddress
            );
            
            if (v4Result.success) {
              console.log('✅ V4 swap with hooks completed successfully');
              console.log('🎣 Hooks executed:', v4Result.v4Features?.hooksExecuted);
              console.log('⛽ Gas savings:', v4Result.v4Features?.gasSavings);
            }
          }
          
          // Fallback to V3 for additional liquidity
          await executeUniswapSwap(tokenInAddress, tokenOutAddress, amountIn, walletAddress);
          console.log('✅ Uniswap swap route calculated successfully');
        }
      }
    } catch (error) {
      console.error('Swap execution failed:', error);
    }
  };

  // Determine button state
  const getButtonState = () => {
    if (!isConnected) {
      return { text: "Connect Wallet", disabled: false };
    }
    if (!amountIn || parseFloat(amountIn) <= 0) return { text: "Enter Amount", disabled: true };
    
    const balance = parseFloat(getBalance(tokenIn.symbol));
    const amount = parseFloat(amountIn);
    
    if (amount > balance) {
      return { text: `Insufficient ${tokenIn.symbol} Balance`, disabled: true };
    }
    if (loading) return { text: "Swapping...", disabled: true };
    return { text: "Review Swap", disabled: false };
  };

  const buttonState = getButtonState();

  return (
    <>
      <Header />
      
      {/* Page Background - Slush Navy */}
      <main className="min-h-screen w-full bg-[#0a0a0f] flex items-center justify-center px-4 pt-24 pb-12">
        
        {/* Main Swap Card */}
        <div className="w-full max-w-[460px] flex flex-col gap-4">
            
            {/* Header Title */}
            <div className="flex justify-between items-center px-2 mb-2">
                <h1 className="text-white text-xl font-semibold tracking-wide">Swap</h1>
                {isConnected && (
                  <div className="text-slush-text text-xs">
                    {walletType === 'turnkey' ? '🔐 Turnkey' : '🌊 Browser'} Wallet
                  </div>
                )}
            </div>

            {/* INPUT CARD 1: YOU PAY */}
            <div className="relative bg-slush-card rounded-[24px] p-5 border border-slush-border hover:border-white/10 transition-colors group">
                <div className="flex justify-between mb-3">
                    <span className="text-slush-text font-medium text-sm">You pay</span>
                    {isConnected && (
                      <span className="text-slush-text font-medium text-sm flex items-center gap-1">
                          Balance: <span className="text-white font-semibold">{getBalance(tokenIn.symbol) || '0.00'}</span>
                          <button 
                            onClick={handleMax}
                            className="text-sui-blue text-xs bg-sui-blue/10 px-2 py-0.5 rounded-full hover:bg-sui-blue/20 transition-colors ml-2 font-bold"
                          >
                            MAX
                          </button>
                      </span>
                    )}
                </div>
                
                <div className="flex items-center justify-between gap-4">
                    {/* Amount Input */}
                    <input 
                        type="number" 
                        placeholder="0"
                        value={amountIn}
                        onChange={(e) => setAmountIn(e.target.value)}
                        className="bg-transparent text-4xl font-semibold text-white placeholder-white/20 outline-none w-full"
                    />

                    {/* Token Select */}
                    <TokenSelector
                      selectedToken={tokenIn}
                      onSelectToken={setTokenIn}
                      excludeToken={tokenOut}
                    />
                </div>
            </div>

            {/* SWITCHER ARROW (Absolute centered) */}
            <div className="relative h-2 z-10 flex items-center justify-center">
                <button 
                  onClick={handleSwapDirection}
                  className="bg-[#0a0a0f] p-3 rounded-full border-4 border-[#0a0a0f] text-sui-blue hover:text-white hover:bg-sui-blue hover:scale-110 hover:rotate-180 transition-all duration-300 shadow-xl group"
                >
                    <ArrowDown className="w-5 h-5 transition-transform duration-300" strokeWidth={3} />
                </button>
            </div>

            {/* INPUT CARD 2: YOU RECEIVE */}
            <div className="bg-slush-card rounded-[24px] p-5 border border-slush-border hover:border-white/10 transition-colors">
                <div className="flex justify-between mb-3">
                    <span className="text-slush-text font-medium text-sm">You receive</span>
                    {isConnected && (
                      <span className="text-slush-text font-medium text-sm">
                          Balance: <span className="text-white font-semibold">{getBalance(tokenOut.symbol) || '0.00'}</span>
                      </span>
                    )}
                </div>
                
                <div className="flex items-center justify-between gap-4">
                    {/* Amount Output (Read Only) */}
                    <div className="text-4xl font-semibold text-white">
                      {quoteLoading ? (
                        <span className="text-white/40">...</span>
                      ) : quote?.estimatedAmountOut ? (
                        quote.estimatedAmountOut
                      ) : (
                        <span className="text-white/40">~</span>
                      )}
                    </div>

                    {/* Token Select */}
                    <TokenSelector
                      selectedToken={tokenOut}
                      onSelectToken={setTokenOut}
                      excludeToken={tokenIn}
                    />
                </div>
            </div>

            {/* QUOTE DETAILS */}
            {amountIn && parseFloat(amountIn) > 0 && quote && (
              <div className="bg-slush-card rounded-[20px] p-4 border border-slush-border space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slush-text text-sm">Rate</span>
                  <span className="text-white text-sm font-semibold">
                    1 {tokenIn.symbol} ≈ {quote.pricePerToken} {tokenOut.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slush-text text-sm">Price Impact</span>
                  <span className={`text-sm font-semibold ${
                    parseFloat(quote.priceImpact) > 5 
                      ? 'text-red-400' 
                      : parseFloat(quote.priceImpact) > 2
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`}>
                    {quote.priceImpact}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slush-text text-sm">Pool</span>
                  <span className="text-white/60 text-xs font-mono">
                    {quote.poolId?.slice(0, 8)}...{quote.poolId?.slice(-6)}
                  </span>
                </div>
              </div>
            )}

            {/* Loading Quote */}
            {amountIn && parseFloat(amountIn) > 0 && quoteLoading && !quote && (
              <div className="bg-slush-card rounded-[20px] p-4 border border-slush-border">
                <div className="flex items-center justify-center gap-2 text-slush-text text-sm">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fetching best quote...
                </div>
              </div>
            )}

            {/* Uniswap V4 Hooks Selector - Advanced DeFi Features */}
            <V4HooksSelector 
              className="mb-2"
              onHookSelect={(hookAddress) => {
                console.log('🎣 V4 Hook selected:', hookAddress);
              }}
            />

            {/* Error Display */}
            {swapError && (
              <div className="px-4 py-3 bg-red-500/10 rounded-2xl border border-red-500/30 text-red-400 text-sm">
                {swapError}
              </div>
            )}

            {/* Success Display */}
            {showSuccess && txDigest && (
              <div className="px-4 py-3 bg-green-500/10 rounded-2xl border border-green-500/30 text-green-400 text-sm">
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

            {/* MAIN ACTION BUTTON */}
            <button 
                onClick={buttonState.disabled || !isConnected ? undefined : handleSwap}
                disabled={buttonState.disabled && isConnected}
                className={`w-full mt-2 bg-sui-blue hover:bg-blue-500 text-white text-lg font-bold py-4 rounded-[20px] shadow-[0_0_30px_rgba(77,162,255,0.3)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                  (buttonState.disabled && isConnected) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Swapping...
                    </>
                ) : (
                    buttonState.text
                )}
            </button>

        </div>
      </main>
      
      {/* Trading Chart with TP/SL Levels */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <TradingChart 
          pair={`${tokenOut.symbol}/${tokenIn.symbol}`}
          currentPrice={quote?.estimatedAmountOut ? parseFloat(quote.estimatedAmountOut) / parseFloat(amountIn || "1") : 0.7970}
        />
      </div>
      
      {/* Uniswap Analytics - Background price monitoring */}
      <UniswapAnalytics 
        tokenSymbol={tokenIn.symbol}
        showDebugInfo={process.env.NODE_ENV === 'development'}
      />
      
      {/* Transaction Limit Modal */}
      <TransactionLimitModal 
        isOpen={showLimitModal} 
        onClose={() => setShowLimitModal(false)} 
      />
    </>
  );
}
