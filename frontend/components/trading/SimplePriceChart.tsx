'use client';

import React, { useEffect, useState } from 'react';

interface SimplePriceChartProps {
  symbol: string;
  height?: number;
}

export default function SimplePriceChart({ symbol, height = 400 }: SimplePriceChartProps) {
  const [currentPrice, setCurrentPrice] = useState<number>(0.85);
  const [priceChange, setPriceChange] = useState<number>(2.34);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  useEffect(() => {
    // Generate initial price history
    const initialHistory = [];
    let price = 0.85;
    for (let i = 0; i < 50; i++) {
      price = Math.max(0.01, price + (Math.random() - 0.5) * 0.02);
      initialHistory.push(price);
    }
    setPriceHistory(initialHistory);
    setCurrentPrice(price);

    // Update price every 3 seconds
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const newPrice = Math.max(0.01, prev + (Math.random() - 0.5) * 0.01);
        setPriceChange(((newPrice - 0.85) / 0.85) * 100);
        
        setPriceHistory(history => [...history.slice(-49), newPrice]);
        
        return newPrice;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Create SVG path for the price line
  const createPath = () => {
    if (priceHistory.length < 2) return '';
    
    const width = 600;
    const chartHeight = height - 120;
    const minPrice = Math.min(...priceHistory);
    const maxPrice = Math.max(...priceHistory);
    const priceRange = maxPrice - minPrice || 0.01;
    
    const points = priceHistory.map((price, index) => {
      const x = (index / (priceHistory.length - 1)) * width;
      const y = chartHeight - ((price - minPrice) / priceRange) * chartHeight;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="w-full">
      {/* Price Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-white">{symbol}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              {currentPrice.toFixed(4)}
            </span>
            <span className={`text-sm px-2 py-1 rounded ${
              priceChange >= 0 ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'
            }`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div>24h High: <span className="text-white">{(currentPrice * 1.05).toFixed(4)}</span></div>
          <div>24h Low: <span className="text-white">{(currentPrice * 0.95).toFixed(4)}</span></div>
          <div>Volume: <span className="text-white">2.4M</span></div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div 
        className="w-full bg-gray-800 border border-gray-700 flex items-center justify-center"
        style={{ height: `${height - 60}px` }}
      >
        {priceHistory.length > 1 ? (
          <svg width="600" height={height - 120} className="overflow-visible">
            <defs>
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00ff88" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1="0"
                y1={ratio * (height - 120)}
                x2="600"
                y2={ratio * (height - 120)}
                stroke="#2B2B43"
                strokeWidth="1"
              />
            ))}
            
            {/* Price line */}
            <path
              d={createPath()}
              stroke="#00ff88"
              strokeWidth="2"
              fill="none"
            />
            
            {/* Fill area under line */}
            <path
              d={`${createPath()} L 600,${height - 120} L 0,${height - 120} Z`}
              fill="url(#priceGradient)"
            />
            
            {/* Current price dot */}
            {priceHistory.length > 0 && (
              <circle
                cx="600"
                cy={(() => {
                  const minPrice = Math.min(...priceHistory);
                  const maxPrice = Math.max(...priceHistory);
                  const priceRange = maxPrice - minPrice || 0.01;
                  return (height - 120) - ((currentPrice - minPrice) / priceRange) * (height - 120);
                })()}
                r="4"
                fill="#00ff88"
                className="animate-pulse"
              />
            )}
          </svg>
        ) : (
          <div className="text-gray-400">Loading chart data...</div>
        )}
      </div>
    </div>
  );
}