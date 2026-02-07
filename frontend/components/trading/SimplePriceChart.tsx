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
  
  // Gaming-style TP/SL levels
  const entryPrice = 0.85;
  const takeProfitPrice = 0.9285;
  const stopLossPrice = 0.765; // 10% below entry
  
  // Calculate PnL
  const pnl = ((currentPrice - entryPrice) / entryPrice) * 100;

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
    <div className="w-full relative">
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
              
              {/* Glowing effects for TP/SL lines */}
              <filter id="tpGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="slGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="entryGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
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
            
            {/* Risk/Reward Zones */}
            {(() => {
              const minPrice = Math.min(...priceHistory);
              const maxPrice = Math.max(...priceHistory);
              const priceRange = maxPrice - minPrice || 0.01;
              
              // Calculate Y positions
              const entryY = (height - 120) - ((entryPrice - minPrice) / priceRange) * (height - 120);
              const tpY = (height - 120) - ((takeProfitPrice - minPrice) / priceRange) * (height - 120);
              const slY = (height - 120) - ((stopLossPrice - minPrice) / priceRange) * (height - 120);
              
              return (
                <>
                  {/* Take Profit Zone (green) */}
                  <rect
                    x="0"
                    y={Math.min(tpY, 0)}
                    width="600"
                    height={Math.max(entryY - tpY, 0)}
                    fill="#00FF41"
                    fillOpacity="0.1"
                  />
                  
                  {/* Stop Loss Zone (red) */}
                  <rect
                    x="0"
                    y={entryY}
                    width="600"
                    height={Math.min(slY - entryY, height - 120 - entryY)}
                    fill="#FF4B4B"
                    fillOpacity="0.1"
                  />
                  
                  {/* Entry Line (cyan) */}
                  <line
                    x1="0"
                    y1={entryY}
                    x2="600"
                    y2={entryY}
                    stroke="#00D9FF"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    filter="url(#entryGlow)"
                    opacity="0.8"
                  />
                  
                  {/* Take Profit Line (neon green) */}
                  <line
                    x1="0"
                    y1={tpY}
                    x2="600"
                    y2={tpY}
                    stroke="#00FF41"
                    strokeWidth="3"
                    filter="url(#tpGlow)"
                  />
                  
                  {/* Stop Loss Line (red) */}
                  <line
                    x1="0"
                    y1={slY}
                    x2="600"
                    y2={slY}
                    stroke="#FF4B4B"
                    strokeWidth="3"
                    filter="url(#slGlow)"
                  />
                  
                  {/* Labels with target reticles */}
                  <g>
                    {/* TP Label */}
                    <rect
                      x="10"
                      y={tpY - 15}
                      width="80"
                      height="24"
                      rx="12"
                      fill="rgba(0, 0, 0, 0.8)"
                      stroke="#00FF41"
                      strokeWidth="1"
                    />
                    <circle cx="25" cy={tpY - 3} r="6" fill="none" stroke="#00FF41" strokeWidth="1.5" />
                    <circle cx="25" cy={tpY - 3} r="2" fill="#00FF41" />
                    <text
                      x="35"
                      y={tpY - 3}
                      fill="#00FF41"
                      fontSize="11"
                      fontWeight="bold"
                      dominantBaseline="middle"
                    >
                      TP {takeProfitPrice.toFixed(4)}
                    </text>
                  </g>
                  
                  <g>
                    {/* SL Label */}
                    <rect
                      x="10"
                      y={slY - 15}
                      width="80"
                      height="24"
                      rx="12"
                      fill="rgba(0, 0, 0, 0.8)"
                      stroke="#FF4B4B"
                      strokeWidth="1"
                    />
                    <circle cx="25" cy={slY - 3} r="6" fill="none" stroke="#FF4B4B" strokeWidth="1.5" />
                    <circle cx="25" cy={slY - 3} r="2" fill="#FF4B4B" />
                    <text
                      x="35"
                      y={slY - 3}
                      fill="#FF4B4B"
                      fontSize="11"
                      fontWeight="bold"
                      dominantBaseline="middle"
                    >
                      SL {stopLossPrice.toFixed(4)}
                    </text>
                  </g>
                  
                  <g>
                    {/* Entry Label */}
                    <rect
                      x="10"
                      y={entryY - 15}
                      width="90"
                      height="24"
                      rx="12"
                      fill="rgba(0, 0, 0, 0.8)"
                      stroke="#00D9FF"
                      strokeWidth="1"
                    />
                    <text
                      x="25"
                      y={entryY - 3}
                      fill="#00D9FF"
                      fontSize="11"
                      fontWeight="bold"
                      dominantBaseline="middle"
                    >
                      ENTRY {entryPrice.toFixed(4)}
                    </text>
                  </g>
                </>
              );
            })()}
            
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
              <>
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
                
                {/* Diamond marker for current price */}
                <path
                  d={`M 600,${(() => {
                    const minPrice = Math.min(...priceHistory);
                    const maxPrice = Math.max(...priceHistory);
                    const priceRange = maxPrice - minPrice || 0.01;
                    const y = (height - 120) - ((currentPrice - minPrice) / priceRange) * (height - 120);
                    return `${y - 6} L 606,${y} L 600,${y + 6} L 594,${y}`;
                  })()}} Z`}
                  fill="#00ff88"
                  stroke="#003322"
                  strokeWidth="1"
                />
              </>
            )}
          </svg>
        ) : (
          <div className="text-gray-400">Loading chart data...</div>
        )}
      </div>
      
      {/* Active Position HUD Widget */}
      <div className="absolute top-24 right-6 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 w-64 shadow-2xl">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 font-bold text-sm uppercase tracking-wider">Active Position</span>
            </div>
          </div>
          
          {/* PnL Display */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs uppercase">Unrealized PnL</span>
              <span className={`text-lg font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Entry</span>
              <span className="text-cyan-400 font-mono text-sm">{entryPrice.toFixed(4)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Current</span>
              <span className="text-white font-mono text-sm">{currentPrice.toFixed(4)}</span>
            </div>
            
            <div className="h-px bg-cyan-500/30 my-2"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-green-400 text-xs">Take Profit</span>
              <span className="text-green-400 font-mono text-sm">{takeProfitPrice.toFixed(4)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-red-400 text-xs">Stop Loss</span>
              <span className="text-red-400 font-mono text-sm">{stopLossPrice.toFixed(4)}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <button className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded px-3 py-2 text-xs font-bold uppercase transition-all">
              Close
            </button>
            <button className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50 rounded px-3 py-2 text-xs font-bold uppercase transition-all">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}