import { useState, useCallback, useEffect } from 'react';
import { 
  uniswapV4HooksService, 
  executeV4SwapWithHooks, 
  getV4HookCapabilities,
  HookType,
  CustomHookConfig,
  V4PoolConfig
} from '@/lib/uniswap/v4HooksService';

export interface V4SwapResult {
  success: boolean;
  txHash?: string;
  amountOut?: string;
  gasUsed?: string;
  priceImpact?: string;
  hooksExecuted?: string[];
  gasSavings?: string;
  beforeSwapData?: any;
  afterSwapData?: any;
  v4Features?: {
    hooksExecuted: string[];
    gasSavings: string;
    flashAccounting: boolean;
    singleton: boolean;
  };
  error?: string;
}

export interface V4Quote {
  quote: string;
  gas: string;
  impact: string;
  hookGasOverhead: string;
  success: boolean;
  error?: string;
  selectedHook?: string;
  hookCapabilities?: string[];
}

/**
 * React Hook for Uniswap V4 Hooks Integration
 * 
 * This hook provides seamless access to Uniswap V4's revolutionary hooks system
 * directly from React components. It manages hook selection, execution, and state.
 */
export function useUniswapV4Hooks() {
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [isServiceReady, setIsServiceReady] = useState(false);
  const [availableHooks, setAvailableHooks] = useState<Record<string, any>>({});
  const [selectedHook, setSelectedHook] = useState<string>('');
  const [quote, setQuote] = useState<V4Quote | null>(null);
  const [lastSwapResult, setLastSwapResult] = useState<V4SwapResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [poolsCreated, setPoolsCreated] = useState<any[]>([]);

  // Initialize V4 service and load available hooks
  useEffect(() => {
    const initializeV4Service = async () => {
      try {
        const ready = await uniswapV4HooksService.initialize();
        setIsServiceReady(ready);
        
        if (ready) {
          const hooks = getV4HookCapabilities();
          setAvailableHooks(hooks);
          
          // Set default hook to dynamic fee hook
          const hookAddresses = uniswapV4HooksService.getHookAddresses();
          setSelectedHook(hookAddresses.DYNAMIC_FEE_HOOK);
          
          console.log('🎣 V4 Hooks Service Ready:', Object.keys(hooks));
        }
      } catch (err) {
        console.error('V4 initialization failed:', err);
        setError(err instanceof Error ? err.message : 'V4 initialization failed');
      }
    };

    initializeV4Service();
  }, []);

  /**
   * Get V4 quote with hooks considerations
   */
  const getV4Quote = useCallback(async (
    tokenIn: string,
    tokenOut: string,
    amount: string,
    hookAddress?: string
  ) => {
    if (!amount || parseFloat(amount) <= 0) {
      setQuote(null);
      return null;
    }

    setQuoteLoading(true);
    setError(null);

    try {
      const useHook = hookAddress || selectedHook;
      const hookInfo = Object.values(availableHooks).find(
        (h: any) => h.address === useHook
      );

      console.log(`🎣 Getting V4 quote with hook: ${hookInfo?.description || 'Unknown'}`);
      
      // Simulate V4 quote calculation with hooks
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const baseQuote = (parseFloat(amount) * 1847.5).toFixed(6);
      const hookGasOverhead = hookInfo?.gasOverhead || '8000';
      const totalGas = (145000 + parseInt(hookGasOverhead)).toString();
      
      const v4Quote: V4Quote = {
        quote: baseQuote,
        gas: totalGas,
        impact: '0.08',
        hookGasOverhead,
        success: true,
        selectedHook: useHook,
        hookCapabilities: hookInfo?.capabilities || []
      };

      setQuote(v4Quote);
      console.log('✅ V4 Quote calculated with hooks');
      return v4Quote;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'V4 quote failed';
      setError(errorMessage);
      
      const errorQuote: V4Quote = {
        quote: '0',
        gas: '0',
        impact: '0',
        hookGasOverhead: '0',
        success: false,
        error: errorMessage
      };
      
      setQuote(errorQuote);
      return errorQuote;
    } finally {
      setQuoteLoading(false);
    }
  }, [selectedHook, availableHooks]);

  /**
   * Execute V4 swap with selected hooks
   */
  const executeV4Swap = useCallback(async (
    tokenIn: string,
    tokenOut: string,
    amount: string,
    hookAddress?: string,
    walletAddress?: string
  ) => {
    setLoading(true);
    setError(null);
    setLastSwapResult(null);

    try {
      const useHook = hookAddress || selectedHook;
      console.log('🚀 Executing V4 swap with hooks...');
      
      const result = await executeV4SwapWithHooks(
        tokenIn,
        tokenOut,
        amount,
        useHook,
        walletAddress
      );

      setLastSwapResult(result);
      
      if (result.success) {
        console.log('✅ V4 Swap with hooks completed:', result.txHash);
        console.log('🎣 Hooks executed:', result.v4Features?.hooksExecuted);
        console.log('⛽ Gas savings:', result.v4Features?.gasSavings);
      } else {
        setError(result.error || 'V4 swap failed');
      }

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'V4 swap execution failed';
      setError(errorMessage);
      
      const errorResult: V4SwapResult = {
        success: false,
        error: errorMessage
      };
      
      setLastSwapResult(errorResult);
      return errorResult;
    } finally {
      setLoading(false);
    }
  }, [selectedHook]);

  /**
   * Create a new V4 pool with custom hooks
   */
  const createPoolWithHooks = useCallback(async (config: V4PoolConfig) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🏊 Creating V4 pool with hooks...');
      
      const poolInfo = await uniswapV4HooksService.createPoolWithHooks(config);
      
      if (poolInfo) {
        setPoolsCreated(prev => [...prev, poolInfo]);
        console.log('✅ V4 Pool created with hooks:', poolInfo.poolKey);
        return poolInfo;
      }
      
      throw new Error('Pool creation failed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Pool creation failed';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Switch to different hook for next operations
   */
  const switchHook = useCallback((hookAddress: string) => {
    const hookInfo = Object.values(availableHooks).find(
      (h: any) => h.address === hookAddress
    );
    
    if (hookInfo) {
      setSelectedHook(hookAddress);
      console.log(`🎣 Switched to hook: ${hookInfo.description}`);
    } else {
      console.warn('Hook not found:', hookAddress);
    }
  }, [availableHooks]);

  /**
   * Get hook information by address
   */
  const getHookInfo = useCallback((hookAddress: string) => {
    return Object.values(availableHooks).find(
      (h: any) => h.address === hookAddress
    );
  }, [availableHooks]);

  /**
   * Simulate flash accounting for multiple operations
   */
  const simulateFlashAccounting = useCallback(async (operations: any[]) => {
    try {
      return await uniswapV4HooksService.simulateFlashAccounting(operations);
    } catch (err) {
      console.error('Flash accounting simulation failed:', err);
      return null;
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

  return {
    // State
    loading,
    quoteLoading,
    isServiceReady,
    availableHooks,
    selectedHook,
    quote,
    lastSwapResult,
    error,
    poolsCreated,
    
    // Actions
    getV4Quote,
    executeV4Swap,
    createPoolWithHooks,
    switchHook,
    getHookInfo,
    simulateFlashAccounting,
    reset,
    
    // Utilities
    hookAddresses: uniswapV4HooksService.getHookAddresses(),
    isHooksReady: uniswapV4HooksService.isHooksReady()
  };
}

export default useUniswapV4Hooks;