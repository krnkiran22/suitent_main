'use client';

import React, { useState, useEffect } from 'react';

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

interface OrderBookProps {
  symbol: string;
}

export default function OrderBook({ symbol }: OrderBookProps) {
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [spread, setSpread] = useState<number>(0);
  const [lastPrice, setLastPrice] = useState<number>(0.85);

  // Generate mock orderbook data
  const generateOrderBookData = () => {
    const basePrice = lastPrice;
    const newBids: OrderBookEntry[] = [];
    const newAsks: OrderBookEntry[] = [];
    
    // Generate bids (buy orders) - below current price
    let runningBidTotal = 0;
    for (let i = 0; i < 15; i++) {
      const price = basePrice - (i + 1) * 0.001 - Math.random() * 0.0005;
      const quantity = Math.random() * 10000 + 1000;
      runningBidTotal += quantity;
      
      newBids.push({
        price: Math.max(0.001, price),
        quantity,
        total: runningBidTotal
      });
    }
    
    // Generate asks (sell orders) - above current price
    let runningAskTotal = 0;
    for (let i = 0; i < 15; i++) {
      const price = basePrice + (i + 1) * 0.001 + Math.random() * 0.0005;
      const quantity = Math.random() * 10000 + 1000;
      runningAskTotal += quantity;
      
      newAsks.push({
        price,
        quantity,
        total: runningAskTotal
      });
    }
    
    setBids(newBids);
    setAsks(newAsks.reverse()); // Reverse to show lowest ask first
    setSpread(newAsks[newAsks.length - 1].price - newBids[0].price);
  };

  useEffect(() => {
    generateOrderBookData();
    const interval = setInterval(generateOrderBookData, 2000);
    return () => clearInterval(interval);
  }, [lastPrice]);

  // Update last price periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLastPrice(prev => Math.max(0.01, prev + (Math.random() - 0.5) * 0.01));
    }, 3000);
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

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-2">Order Book</h3>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Price</span>
          <span>Quantity</span>
          <span>Total</span>
        </div>
      </div>

      <div className="h-96 overflow-hidden">
        {/* Asks (Sell Orders) - Red */}
        <div className="h-44 overflow-y-auto">
          <div className="p-2">
            {asks.map((ask, index) => {
              const maxTotal = Math.max(...asks.map(a => a.total));
              const fillPercentage = (ask.total / maxTotal) * 100;
              
              return (
                <div
                  key={index}
                  className="relative flex justify-between text-xs py-1 hover:bg-red-900/20 cursor-pointer"
                  style={{
                    background: `linear-gradient(to left, rgba(239, 68, 68, 0.1) ${fillPercentage}%, transparent ${fillPercentage}%)`
                  }}
                >
                  <span className="text-red-400 font-mono">{formatNumber(ask.price)}</span>
                  <span className="text-gray-300 font-mono">{formatQuantity(ask.quantity)}</span>
                  <span className="text-gray-500 font-mono">{formatQuantity(ask.total)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spread */}
        <div className="px-4 py-2 bg-gray-800 border-y border-gray-700">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Spread</span>
            <span className="text-yellow-400 font-mono">{formatNumber(spread, 5)}</span>
            <span className="text-gray-400">
              ({((spread / lastPrice) * 100).toFixed(3)}%)
            </span>
          </div>
          <div className="text-center mt-1">
            <span className="text-white font-mono text-lg">{formatNumber(lastPrice)}</span>
            <span className="text-green-400 text-xs ml-2">Last Price</span>
          </div>
        </div>

        {/* Bids (Buy Orders) - Green */}
        <div className="h-44 overflow-y-auto">
          <div className="p-2">
            {bids.map((bid, index) => {
              const maxTotal = Math.max(...bids.map(b => b.total));
              const fillPercentage = (bid.total / maxTotal) * 100;
              
              return (
                <div
                  key={index}
                  className="relative flex justify-between text-xs py-1 hover:bg-green-900/20 cursor-pointer"
                  style={{
                    background: `linear-gradient(to left, rgba(34, 197, 94, 0.1) ${fillPercentage}%, transparent ${fillPercentage}%)`
                  }}
                >
                  <span className="text-green-400 font-mono">{formatNumber(bid.price)}</span>
                  <span className="text-gray-300 font-mono">{formatQuantity(bid.quantity)}</span>
                  <span className="text-gray-500 font-mono">{formatQuantity(bid.total)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Best Bid: <span className="text-green-400">{formatNumber(bids[0]?.price || 0)}</span></span>
          <span>Best Ask: <span className="text-red-400">{formatNumber(asks[asks.length - 1]?.price || 0)}</span></span>
        </div>
      </div>
    </div>
  );
}