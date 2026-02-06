'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useTurnkey } from '@turnkey/react-wallet-kit';
import { useDeepBookTrader } from '../../hooks/useDeepBookTrader';
import { useTraderBalances } from '../../hooks/useTraderBalances';

export default function TradePage() {
  const [quantityUsdt, setQuantityUsdt] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const currentAccount = useCurrentAccount();
  const { wallets: turnkeyWallets } = useTurnkey();
  const turnkeyWallet = turnkeyWallets?.[0];
  const turnkeyAddress = turnkeyWallet?.addresses?.[0];

  const walletAddress = currentAccount?.address || turnkeyAddress;
  const walletType = currentAccount ? 'standard' : (turnkeyAddress ? 'turnkey' : null);

  const {
    trader,
    isInitialized,
    createBalanceManager,
    depositUsdt,
    buySuiWithUsdtMarket,
    sellSuiForUsdtMarket,
    checkManagerBalance
  } = useDeepBookTrader(walletAddress, walletType);

  const { balances, loading: balancesLoading, refetch } = useTraderBalances(trader, isInitialized);

  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [quantityUsdt, depositAmount]);

  const handleCreateBalanceManager = async () => {
    if (!trader) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await createBalanceManager();
      setSuccess('Balance Manager created successfully!');
      await refetch();
    } catch (err: any) {
      setError(err.message || 'Failed to create Balance Manager');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!trader || !depositAmount) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const amount = parseFloat(depositAmount);
      await depositUsdt(amount);
      setSuccess(`Deposited ${amount} USDT successfully!`);
      setDepositAmount('');
      await refetch();
    } catch (err: any) {
      setError(err.message || 'Failed to deposit USDT');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyOrder = async () => {
    if (!trader || !quantityUsdt) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const quantity = parseFloat(quantityUsdt);
      const result = await buySuiWithUsdtMarket(quantity);
      setSuccess(`Buy order executed! Transaction: ${result.digest}`);
      setQuantityUsdt('');
      await refetch();
    } catch (err: any) {
      setError(err.message || 'Failed to execute buy order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellOrder = async () => {
    if (!trader || !quantityUsdt) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const quantity = parseFloat(quantityUsdt);
      const result = await sellSuiForUsdtMarket(quantity);
      setSuccess(`Sell order executed! Transaction: ${result.digest}`);
      setQuantityUsdt('');
      await refetch();
    } catch (err: any) {
      setError(err.message || 'Failed to execute sell order');
    } finally {
      setIsLoading(false);
    }
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slush-bg via-slush-bg to-slush-card flex items-center justify-center">
        <div className="bg-slush-card border border-slush-border rounded-3xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">DeepBook Trading</h1>
            <p className="text-slush-text mb-6">Connect your wallet to start trading</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slush-bg via-slush-bg to-slush-card py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">DeepBook Trading</h1>
        
        {/* Wallet Info */}
        <div className="bg-slush-card border border-slush-border rounded-3xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Wallet Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slush-text">Wallet Type:</span>
              <span className="text-white capitalize">{walletType || 'Not connected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slush-text">Address:</span>
              <span className="text-white font-mono text-sm">
                {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slush-text">Balance Manager:</span>
              <span className={`${isInitialized ? 'text-green-400' : 'text-yellow-400'}`}>
                {isInitialized ? 'Ready' : 'Not Created'}
              </span>
            </div>
          </div>
        </div>

        {/* Balance Manager Setup */}
        {!isInitialized && (
          <div className="bg-slush-card border border-slush-border rounded-3xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Setup Balance Manager</h2>
            <p className="text-slush-text mb-4">
              Before trading, you need to create a Balance Manager. This is a one-time setup.
            </p>
            <button
              onClick={handleCreateBalanceManager}
              disabled={isLoading}
              className="w-full bg-sui-blue hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Balance Manager'}
            </button>
          </div>
        )}

        {/* Manager Balances */}
        {isInitialized && (
          <div className="bg-slush-card border border-slush-border rounded-3xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Manager Balances</h2>
            {balancesLoading ? (
              <div className="text-center py-4">
                <div className="animate-pulse text-slush-text">Loading balances...</div>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(balances || {}).map(([token, balance]) => (
                  <div key={token} className="flex justify-between items-center bg-slush-bg rounded-xl p-3">
                    <span className="text-white font-semibold">{token}</span>
                    <span className="text-slush-text">{balance}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Deposit Section */}
        {isInitialized && (
          <div className="bg-slush-card border border-slush-border rounded-3xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Deposit USDT</h2>
            <p className="text-slush-text mb-4">Deposit USDT into your Balance Manager to start trading</p>
            <div className="space-y-4">
              <div>
                <label className="block text-slush-text text-sm mb-2">Amount (USDT)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount to deposit"
                  className="w-full bg-slush-bg border border-slush-border rounded-xl px-4 py-3 text-white placeholder-slush-text focus:outline-none focus:border-sui-blue"
                />
              </div>
              <button
                onClick={handleDeposit}
                disabled={isLoading || !depositAmount}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-colors"
              >
                {isLoading ? 'Depositing...' : 'Deposit USDT'}
              </button>
            </div>
          </div>
        )}

        {/* Trading Section */}
        {isInitialized && (
          <div className="bg-slush-card border border-slush-border rounded-3xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Market Orders</h2>
            <p className="text-slush-text mb-4">Place market orders to buy or sell SUI using USDT</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slush-text text-sm mb-2">Quantity (USDT for buy, SUI for sell)</label>
                <input
                  type="number"
                  value={quantityUsdt}
                  onChange={(e) => setQuantityUsdt(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full bg-slush-bg border border-slush-border rounded-xl px-4 py-3 text-white placeholder-slush-text focus:outline-none focus:border-sui-blue"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleBuyOrder}
                  disabled={isLoading || !quantityUsdt}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Buy SUI'}
                </button>
                
                <button
                  onClick={handleSellOrder}
                  disabled={isLoading || !quantityUsdt}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Sell SUI'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-6">
            <p className="text-green-400">{success}</p>
          </div>
        )}
      </div>
    </div>
  );
}