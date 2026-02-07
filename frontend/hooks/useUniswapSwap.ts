import { useState, useCallback, useEffect } from 'react';
import { uniswapSwapService, getUniswapQuote, executeUniswapSwap, UNISWAP_TOKENS } from '@/lib/uniswap/swapService';

export interface UniswapQuote {
  quote: string;
  gas: string;
  impact: string;
  success: boolean;
  error?: string;
}

export interface UniswapSwapResult {
  success: boolean;
  txHash?: string;
  quote?: string;
  gasUsed?: string;
  priceImpact?: string;
  error?: string;
}

export function useUniswapSwap() {
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quote, setQuote] = useState<UniswapQuote | null>(null);
  const [lastSwapResult, setLastSwapResult] = useState<UniswapSwapResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isServiceReady, setIsServiceReady] = useState(false);

  // Initialize service on hook mount
  useEffect(() => {
    const initService = async () => {
      const ready = await uniswapSwapService.initialize();
      setIsServiceReady(ready);
      
      if (!ready) {
        console.warn('Uniswap service initialization failed - operating in fallback mode');
      }
    };

    initService();
  }, []);

  /**
   * Get price quote from Uniswap
   */
  const getQuote = useCallback(async (
    tokenInAddress: string,
    tokenOutAddress: string,
    amount: string
  ) => {
    if (!amount || parseFloat(amount) <= 0) {
      setQuote(null);
      return null;
    }

    setQuoteLoading(true);
    setError(null);

    try {
      const result = await getUniswapQuote(tokenInAddress, tokenOutAddress, amount);
      
      const quoteData: UniswapQuote = {
        quote: result.quote,
        gas: result.gas,
        impact: result.impact,
        success: result.success,
        error: result.error
      };

      setQuote(quoteData);
      return quoteData;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Quote fetch failed';
      setError(errorMessage);
      
      const errorQuote: UniswapQuote = {
        quote: '0',
        gas: '0',
        impact: '0',
        success: false,
        error: errorMessage
      };
      
      setQuote(errorQuote);
      return errorQuote;

    } finally {
      setQuoteLoading(false);
    }
  }, []);

  /**
   * Execute swap transaction
   */
  const executeSwap = useCallback(async (
    tokenInAddress: string,
    tokenOutAddress: string,
    amount: string,
    walletAddress?: string
  ) => {
    setLoading(true);
    setError(null);
    setLastSwapResult(null);

    try {
      console.log('🚀 Initiating Uniswap swap transaction...');
      
      const result = await executeUniswapSwap(
        tokenInAddress,
        tokenOutAddress,
        amount,
        walletAddress
      );

      setLastSwapResult(result);
      
      if (result.success) {
        console.log('✅ Uniswap swap completed successfully:', result.txHash);
      } else {
        setError(result.error || 'Swap execution failed');
      }

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Swap execution failed';
      setError(errorMessage);
      
      const errorResult: UniswapSwapResult = {
        success: false,
        error: errorMessage
      };
      
      setLastSwapResult(errorResult);
      return errorResult;

    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setQuote(null);
    setLastSwapResult(null);
    setError(null);
    setLoading(false);
    setQuoteLoading(false);
  }, []);

  /**
   * Check if token pair is supported
   */
  const isTokenPairSupported = useCallback((tokenIn: string, tokenOut: string) => {
    return uniswapSwapService.isTokenPairSupported(tokenIn, tokenOut);
  }, []);

  /**
   * Get token price in USDC
   */
  const getTokenPrice = useCallback(async (tokenAddress: string) => {
    try {
      return await uniswapSwapService.getTokenPrice(tokenAddress);
    } catch (err) {
      console.warn('Token price fetch failed:', err);
      return 0;
    }
  }, []);

  return {
    // State
    loading,
    quoteLoading,
    quote,
    lastSwapResult,
    error,
    isServiceReady,
    
    // Actions
    getQuote,
    executeSwap,
    reset,
    isTokenPairSupported,
    getTokenPrice,
    
    // Constants
    supportedTokens: UNISWAP_TOKENS
  };
}

// Export hook and types
export default useUniswapSwap;