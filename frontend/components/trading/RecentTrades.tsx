'use client';

import React, { useState, useEffect } from 'react';

interface Trade {
  id: string;
  price: number;
  quantity: number;
  time: string;
  side: 'buy' | 'sell';
}

interface RecentTradesProps {
  symbol: string;
}

export default function RecentTrades({ symbol }: RecentTradesProps) {
  const [trades, setTrades] = useState<Trade[]>([]);

  // Generate mock trade data
  const generateTrade = (): Trade => {
    const basePrice = 0.85;
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    const priceVariation = (Math.random() - 0.5) * 0.02;
    const price = basePrice + priceVariation;
    const quantity = Math.random() * 5000 + 100;
    const time = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });

    return {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      price: Math.max(0.01, price),
      quantity,
      time,
      side
    };
  };

  useEffect(() => {
    // Generate initial trades
    const initialTrades = Array.from({ length: 20 }, generateTrade)
      .sort((a, b) => new Date(`1970/01/01 ${b.time}`).getTime() - new Date(`1970/01/01 ${a.time}`).getTime());
    
    setTrades(initialTrades);

    // Add new trades periodically
    const interval = setInterval(() => {
      const newTrade = generateTrade();
      setTrades(prev => [newTrade, ...prev.slice(0, 49)]); // Keep last 50 trades
    }, Math.random() * 3000 + 2000); // 2-5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number, decimals: number = 4) => {
    return num.toFixed(decimals);
  };

  const formatQuantity = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  const calculateTotal = (price: number, quantity: number) => {
    return formatNumber(price * quantity, 2);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-2">Recent Trades</h3>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Price</span>
          <span>Quantity</span>
          <span>Time</span>
        </div>
      </div>

      {/* Trades List */}
      <div className="h-96 overflow-y-auto">
        <div className="p-2">
          {trades.map((trade, index) => (
            <div
              key={trade.id}
              className={`flex justify-between items-center text-xs py-1.5 px-2 rounded hover:bg-gray-800/50 transition-colors ${
                index < 3 ? 'animate-pulse bg-gray-800/30' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                <span 
                  className={`font-mono ${
                    trade.side === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {formatNumber(trade.price)}
                </span>
                <span className={`text-xs px-1 py-0.5 rounded ${
                  trade.side === 'buy' ? 'bg-green-400/20 text-green-300' : 'bg-red-400/20 text-red-300'
                }`}>
                  {trade.side.toUpperCase()}
                </span>
              </div>
              
              <span className="text-gray-300 font-mono">
                {formatQuantity(trade.quantity)}
              </span>
              
              <span className="text-gray-500 font-mono text-xs">
                {trade.time}
              </span>
            </div>
          ))}
          
          {trades.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading trades...
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-gray-700 text-xs">
        <div className="flex justify-between text-gray-400">
          <span>
            24h Volume: <span className="text-white">2.4M DEEP</span>
          </span>
          <span>
            Trades: <span className="text-white">{trades.length}</span>
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <span>
            Last: <span className={`${
              trades[0]?.side === 'buy' ? 'text-green-400' : 'text-red-400'
            }`}>
              {trades[0] ? formatNumber(trades[0].price) : '---'}
            </span>
          </span>
          <span>
            Avg Size: <span className="text-white">
              {trades.length > 0 ? formatQuantity(trades.reduce((sum, t) => sum + t.quantity, 0) / trades.length) : '---'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}