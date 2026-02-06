'use client';

import React, { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useTurnkey } from '@turnkey/react-wallet-kit';
import { useDeepBookTrader } from '../../hooks/useDeepBookTrader';
import { useTraderBalances } from '../../hooks/useTraderBalances';
import { useMarketData } from '../../hooks/useMarketData';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, TrendingUp } from 'lucide-react';
import TradingChart from '../../components/trading/SimplePriceChart';
import OrderBook from '../../components/trading/OrderBook';
import RecentTrades from '../../components/trading/RecentTrades';

// Mock data for order book display
const ASKS = [
  { price: "0.8553", size: "2.3K", total: "101.7K" },
  { price: "0.8544", size: "7.3K", total: "99.4K" },
  { price: "0.8534", size: "2.7K", total: "92.1K" },
  { price: "0.8526", size: "1.5K", total: "89.4K" },
];

const BIDS = [
  { price: "0.8392", size: "7.3K", total: "15.8K" },
  { price: "0.8382", size: "8.4K", total: "12.2K" },
  { price: "0.8350", size: "12.1K", total: "9.5K" },
  { price: "0.8310", size: "5.5K", total: "4.1K" },
];

export default function TradePage() {
  const currentAccount = useCurrentAccount();
  const { wallets: turnkeyWallets } = useTurnkey();
  const [walletType, setWalletType] = useState<'standard' | 'turnkey' | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');

  // Determine wallet type and address
  useEffect(() => {
    if (currentAccount) {
      setWalletType('standard');
      setWalletAddress(currentAccount.address);
    } else if (turnkeyWallets && turnkeyWallets.length > 0) {
      setWalletType('turnkey');
      setWalletAddress(turnkeyWallets[0].address);
    } else {
      setWalletType(null);
      setWalletAddress('');
    }
  }, [currentAccount, turnkeyWallets]);

  const {
    trader,
    isInitialized,
    balanceManagerAddress,
    createBalanceManager,
    depositToken,
    placeMarketBuyOrder,
    placeMarketSellOrder,
    placeLimitBuyOrder,
    placeLimitSellOrder
  } = useDeepBookTrader(walletAddress, walletType);

  const { balances, loading: balancesLoading, refetch: refetchBalances } = useTraderBalances(trader, isInitialized);
  const { marketData, isConnected } = useMarketData('DEEP/SUI');
  const [loading, setLoading] = useState(false);

  // Update price when market data changes for limit orders
  useEffect(() => {
    if (orderType === 'market') {
      setPrice(marketData.price.toFixed(4));
    }
  }, [marketData.price, orderType]);

  const handleCreateBalanceManager = async () => {
    if (!trader) return;
    setLoading(true);
    try {
      await createBalanceManager();
    } catch (error) {
      console.error('Failed to create balance manager:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (tokenType: 'DEEP' | 'SUI') => {
    if (!trader || !depositAmount) return;
    setLoading(true);
    try {
      await depositToken(parseFloat(depositAmount), tokenType);
      setDepositAmount('');
      setTimeout(() => refetchBalances(), 2000);
    } catch (error) {
      console.error(`Failed to deposit ${tokenType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!trader || !amount) return;
    
    setLoading(true);
    try {
      const quantity = parseFloat(amount);
      const orderPrice = parseFloat(price);

      if (orderType === 'market') {
        if (side === 'buy') {
          await placeMarketBuyOrder(quantity * marketData.price);
        } else {
          await placeMarketSellOrder(quantity);
        }
      } else {
        if (side === 'buy') {
          await placeLimitBuyOrder(quantity, orderPrice);
        } else {
          await placeLimitSellOrder(quantity, orderPrice);
        }
      }
      
      setAmount('');
      setTimeout(() => refetchBalances(), 2000);
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const qty = parseFloat(amount) || 0;
    const prc = parseFloat(price) || marketData.price;
    return (qty * prc).toFixed(4);
  };

  if (!walletAddress) {
    return (
      <main className="min-h-screen w-full bg-[#0a0a0f] text-white pt-24 px-4 pb-4 overflow-hidden">
        <div className="max-w-[1600px] mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="bg-[#131825] border border-white/5 rounded-3xl p-8 text-center shadow-xl">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-gray-400">Please connect your wallet to start trading on DeepBook</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* MAIN CONTAINER */}
      <main className="min-h-screen w-full bg-[#0a0a0f] text-white pt-24 px-4 pb-4 overflow-hidden">
        
        {/* TOP BAR: Market Stats */}
        <div className="max-w-[1600px] mx-auto mb-4 flex items-center justify-between bg-[#131825] border border-white/5 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-xl">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                  DEEP / SUI 
                  <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                    V3
                  </span>
                </h1>
                <p className="text-sm text-blue-400 font-mono">{marketData.price.toFixed(4)}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10 mx-2"></div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">24h Change</p>
              <p className={`text-sm font-mono flex items-center gap-1 ${
                marketData.change24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {marketData.change24h >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">24h Volume</p>
              <p className="text-sm font-mono text-white">{(marketData.volume24h / 1000000).toFixed(1)}M DEEP</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-xs font-mono text-gray-300">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Wallet Status Pill */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-gray-300">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
            {balanceManagerAddress && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20">
                ✓ BM
              </span>
            )}
          </div>
        </div>

        {!isInitialized ? (
          /* Balance Manager Setup */
          <div className="max-w-[1600px] mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="bg-[#131825] border border-white/5 rounded-3xl p-8 text-center shadow-xl max-w-md">
              <Activity className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h2 className="text-xl font-bold mb-4">Setup Required</h2>
              <p className="text-gray-400 mb-6">
                Create a Balance Manager to start trading on DeepBook V3
              </p>
              <button
                onClick={handleCreateBalanceManager}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 text-white py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
              >
                {loading ? 'Creating...' : 'Create Balance Manager'}
              </button>
            </div>
          </div>
        ) : (
          /* GRID LAYOUT */
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
            
            {/* LEFT COLUMN: Balances & Quick Deposit (Span 3) */}
            <div className="col-span-3 flex flex-col gap-4">
              
              {/* 1. Balances Card */}
              <div className="bg-[#131825] border border-white/5 rounded-3xl p-6 flex-1 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Wallet className="text-blue-400" size={20} />
                  <h3 className="font-bold text-gray-200">Account</h3>
                </div>
                
                <div className="space-y-4">
                  {balancesLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-16 bg-[#0a0a0f] rounded-2xl"></div>
                      <div className="h-16 bg-[#0a0a0f] rounded-2xl"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center p-4 bg-[#0a0a0f] rounded-2xl border border-white/5">
                        <span className="text-sm text-gray-400">DEEP</span>
                        <span className="font-mono text-lg font-medium">{balances.DEEP || '0.00'}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-[#0a0a0f] rounded-2xl border border-white/5">
                        <span className="text-sm text-gray-400">SUI</span>
                        <span className="font-mono text-lg font-medium">{balances.SUI || '0.00'}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <button 
                  onClick={refetchBalances}
                  className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all"
                >
                  Refresh Balances
                </button>
              </div>

              {/* 2. Quick Deposit */}
              <div className="bg-[#131825] border border-white/5 rounded-3xl p-6 h-auto shadow-xl">
                <h3 className="font-bold text-gray-200 mb-4 text-sm">Quick Deposit</h3>
                
                <div className="mb-4">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-white/5 rounded-xl p-3 text-white font-mono outline-none focus:border-blue-500/50 transition-all"
                    placeholder="Amount"
                    step="0.01"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleDeposit('DEEP')}
                    disabled={loading || !depositAmount}
                    className="py-3 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition-all text-sm font-bold border border-purple-500/30 disabled:opacity-50"
                  >
                    Deposit DEEP
                  </button>
                  <button 
                    onClick={() => handleDeposit('SUI')}
                    disabled={loading || !depositAmount}
                    className="py-3 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-sm font-bold border border-blue-500/30 disabled:opacity-50"
                  >
                    Deposit SUI
                  </button>
                </div>
              </div>
            </div>

            {/* MIDDLE COLUMN: Chart (Span 6) */}
            <div className="col-span-6 bg-[#131825] border border-white/5 rounded-3xl p-1 relative overflow-hidden shadow-xl flex flex-col">
              {/* Chart Header */}
              <div className="h-10 px-4 flex items-center border-b border-white/5 gap-4">
                <button className="text-xs font-bold text-white border-b-2 border-blue-400 h-full pt-1">Price</button>
                <button className="text-xs font-medium text-gray-500 hover:text-white h-full pt-1">Depth</button>
              </div>
              
              {/* Chart */}
              <div className="flex-1 bg-[#0a0a0f] m-1 rounded-2xl overflow-hidden">
                <TradingChart 
                  symbol="DEEP/SUI" 
                  height={520}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Order Book & Execution (Span 3) */}
            <div className="col-span-3 flex flex-col gap-4">
              
              {/* 1. Order Book */}
              <div className="bg-[#131825] border border-white/5 rounded-3xl p-4 flex-[0.6] shadow-xl overflow-hidden flex flex-col">
                <h3 className="text-sm font-bold text-gray-200 mb-3 px-2">Order Book</h3>
                
                {/* Header */}
                <div className="grid grid-cols-3 text-[10px] text-gray-500 uppercase px-2 mb-2 font-medium tracking-wider">
                  <span className="text-left">Price</span>
                  <span className="text-right">Size</span>
                  <span className="text-right">Total</span>
                </div>

                {/* Asks (Sells) */}
                <div className="flex-1 overflow-hidden flex flex-col-reverse justify-end pb-2">
                  {ASKS.map((ask, i) => (
                    <div key={i} className="grid grid-cols-3 text-xs font-mono py-0.5 px-2 hover:bg-white/5 cursor-pointer group relative">
                      <span className="text-red-400 group-hover:text-red-300">{ask.price}</span>
                      <span className="text-right text-gray-400">{ask.size}</span>
                      <span className="text-right text-gray-500">{ask.total}</span>
                      <div className="absolute right-0 top-0 bottom-0 bg-red-500/10 w-[30%] pointer-events-none"></div>
                    </div>
                  ))}
                </div>

                {/* Spread Indicator */}
                <div className="py-2 my-1 border-y border-white/5 flex justify-between items-center px-2 bg-white/5">
                  <span className="text-blue-400 font-mono font-bold text-sm">{marketData.price.toFixed(4)}</span>
                  <span className="text-[10px] text-gray-400">Spread 0.2%</span>
                </div>

                {/* Bids (Buys) */}
                <div className="flex-1 overflow-hidden pt-2">
                  {BIDS.map((bid, i) => (
                    <div key={i} className="grid grid-cols-3 text-xs font-mono py-0.5 px-2 hover:bg-white/5 cursor-pointer group relative">
                      <span className="text-green-400 group-hover:text-green-300">{bid.price}</span>
                      <span className="text-right text-gray-400">{bid.size}</span>
                      <span className="text-right text-gray-500">{bid.total}</span>
                      <div className="absolute right-0 top-0 bottom-0 bg-green-500/10 w-[45%] pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Place Order Form */}
              <div className="bg-[#131825] border border-white/5 rounded-3xl p-5 flex-1 shadow-xl">
                
                {/* Buy/Sell Tabs */}
                <div className="flex bg-[#0a0a0f] p-1 rounded-xl mb-4 border border-white/5">
                  <button 
                    onClick={() => setSide("buy")}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                      side === 'buy' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    Buy
                  </button>
                  <button 
                    onClick={() => setSide("sell")}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                      side === 'sell' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                {/* Order Type */}
                <div className="flex gap-4 mb-4 px-1">
                  <button 
                    onClick={() => setOrderType("market")}
                    className={`text-xs font-bold ${
                      orderType === 'market' ? 'text-white border-b-2 border-white pb-0.5' : 'text-gray-500'
                    }`}
                  >
                    Market
                  </button>
                  <button 
                    onClick={() => setOrderType("limit")}
                    className={`text-xs font-bold ${
                      orderType === 'limit' ? 'text-white border-b-2 border-white pb-0.5' : 'text-gray-500'
                    }`}
                  >
                    Limit
                  </button>
                </div>

                {/* Inputs */}
                <div className="space-y-3">
                  {/* Price Input (Only for Limit) */}
                  {orderType === 'limit' && (
                    <div className="bg-[#0a0a0f] rounded-xl p-3 border border-white/5 hover:border-white/20 transition-colors group">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">
                        Price (SUI)
                      </div>
                      <input 
                        type="text" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="bg-transparent w-full outline-none text-white font-mono text-sm group-focus-within:text-blue-400" 
                      />
                    </div>
                  )}

                  {/* Amount Input */}
                  <div className="bg-[#0a0a0f] rounded-xl p-3 border border-white/5 hover:border-white/20 transition-colors group">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-wider">
                      <span>Amount (DEEP)</span>
                      <span 
                        className="text-blue-400 cursor-pointer hover:text-blue-300"
                        onClick={() => setAmount(balances.DEEP || '0')}
                      >
                        Max
                      </span>
                    </div>
                    <input 
                      type="text" 
                      placeholder="0.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-transparent w-full outline-none text-white font-mono text-lg font-bold group-focus-within:text-blue-400" 
                    />
                  </div>

                  {/* Total Estimator */}
                  <div className="flex justify-between items-center px-1 py-2">
                    <span className="text-xs text-gray-500">Total (SUI)</span>
                    <span className="text-sm font-mono text-white">{calculateTotal()}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  onClick={handlePlaceOrder}
                  disabled={loading || !amount}
                  className={`w-full mt-4 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-50 active:scale-95 ${
                    side === 'buy' 
                      ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' 
                      : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                  }`}
                >
                  {loading ? 'Processing...' : (side === 'buy' ? 'Buy DEEP' : 'Sell DEEP')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}