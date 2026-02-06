'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTraderBalances(trader: any, isInitialized: boolean = false) {
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!trader || !isInitialized) {
      setLoading(false);
      setBalances({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [suiBalance, usdtBalance, deepBalance] = await Promise.allSettled([
        trader.checkManagerBalance('SUI'),
        trader.checkManagerBalance('DBUSDT'),
        trader.checkManagerBalance('DEEP')
      ]);

      const newBalances: { [key: string]: string } = {};

      if (suiBalance.status === 'fulfilled' && suiBalance.value) {
        // checkManagerBalance returns {coinType, balance} object, extract balance
        const balanceObj = suiBalance.value;
        newBalances['SUI'] = typeof balanceObj === 'object' ? balanceObj.balance || '0' : balanceObj || '0';
      } else {
        newBalances['SUI'] = '0';
      }
      
      if (usdtBalance.status === 'fulfilled' && usdtBalance.value) {
        const balanceObj = usdtBalance.value;
        newBalances['USDT'] = typeof balanceObj === 'object' ? balanceObj.balance || '0' : balanceObj || '0';
      } else {
        newBalances['USDT'] = '0';
      }
      
      if (deepBalance.status === 'fulfilled' && deepBalance.value) {
        const balanceObj = deepBalance.value;
        newBalances['DEEP'] = typeof balanceObj === 'object' ? balanceObj.balance || '0' : balanceObj || '0';
      } else {
        newBalances['DEEP'] = '0';
      }

      console.log('[useTraderBalances] Processed balances:', newBalances);
      setBalances(newBalances);
    } catch (err: any) {
      console.error('[useTraderBalances] Error fetching balances:', err);
      setError(err.message || 'Failed to fetch balances');
    } finally {
      setLoading(false);
    }
  }, [trader, isInitialized]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances, isInitialized]);

  const refetch = useCallback(() => {
    return fetchBalances();
  }, [fetchBalances]);

  return {
    balances,
    loading,
    error,
    refetch
  };
}