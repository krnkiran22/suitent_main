"use client";

import React, { useEffect, useState, useRef } from "react";
import { priceService, createPriceMonitor } from "@/services/priceService";

interface TradingChartProps {
  pair?: string;
  currentPrice?: number;
  priceHistory?: Array<{price: number, timestamp: number}>;
  mockTakeProfit?: { price: number; percentage: number };
  mockStopLoss?: { price: number; percentage: number };
}

export const TradingChart: React.FC<TradingChartProps> = ({ 
  pair = "DEEP/SUI", 
  currentPrice: propCurrentPrice = 0.8523,
  priceHistory = [],
  mockTakeProfit,
  mockStopLoss
}) => {
  // Note: useChat is not used here to avoid ChatProvider dependency
  // All TP/SL data comes from props
  
  // Use mock data from props
  // Gaming-style default values with entry point
  const actualCurrentPrice = propCurrentPrice || 0.8523;
  const entryPrice = actualCurrentPrice; // Current price as entry
  const displayTakeProfit = mockTakeProfit || {
    price: 0.9285, // Take profit at 0.9285
    percentage: ((0.9285 - entryPrice) / entryPrice * 100).toFixed(1)
  };
  
  const displayStopLoss = mockStopLoss || {
    price: entryPrice * 0.90, // Default: 10% below entry
    percentage: 10
  };
  
  // Calculate PnL percentage
  const calculatePnL = () => {
    const diff = actualCurrentPrice - entryPrice;
    const pnlPercent = (diff / entryPrice) * 100;
    return pnlPercent;
  };
  
  const pnl = calculatePnL();
  
  // Debug logging
  useEffect(() => {
    console.log("📊 TradingChart - Mock Take Profit:", mockTakeProfit);
    console.log("📊 TradingChart - Mock Stop Loss:", mockStopLoss);
    console.log("📊 TradingChart - Display Take Profit:", displayTakeProfit);
    console.log("📊 TradingChart - Display Stop Loss:", displayStopLoss);
  }, [mockTakeProfit, mockStopLoss, displayTakeProfit, displayStopLoss]);
  
  // Use current price from props
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<Array<{price: number, timestamp: number}>>([]);

  // Load initial chart data and start real-time price updates
  useEffect(() => {
    const loadInitialData = async () => {
      // Load historical data
      const historicalData = await priceService.getHistoricalPrices(pair, 100);
      if (historicalData.success) {
        setChartData(historicalData.data);
      }
    };
    
    loadInitialData();
    
    // Start real-time price monitoring
    const stopMonitoring = createPriceMonitor((newPrice) => {
      // Add new price point to chart
      setChartData(prev => {
        const newData = [...prev.slice(1), { price: newPrice, timestamp: Date.now() }];
        return newData;
      });
    }, 5000); // Update every 5 seconds
    
    return () => stopMonitoring();
  }, [pair]);

  // Check if price hits TP/SL levels with notifications
  useEffect(() => {
    if (mockTakeProfit && actualCurrentPrice >= mockTakeProfit.price) {
      console.log("🎯 Take Profit hit!");
      
      // Show notification
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(`🎯 Take Profit Hit!`, {
            body: `Price reached $${actualCurrentPrice.toFixed(4)} (target: $${mockTakeProfit.price.toFixed(4)})`,
            icon: '/favicon.ico'
          });
        }
      }
    }
    
    if (mockStopLoss && actualCurrentPrice <= mockStopLoss.price) {
      console.log("🛑 Stop Loss hit!");
      
      // Show notification
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(`🛑 Stop Loss Hit!`, {
            body: `Price dropped to $${actualCurrentPrice.toFixed(4)} (target: $${mockStopLoss.price.toFixed(4)})`,
            icon: '/favicon.ico'
          });
        }
      }
    }
  }, [actualCurrentPrice, mockTakeProfit, mockStopLoss]);

  // Request notification permission on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  const chartHeight = 300;
  const chartWidth = 600;
  
  // Calculate price range for chart scaling
  const allPrices = [...chartData.map(d => d.price)];
  if (displayTakeProfit) allPrices.push(displayTakeProfit.price);
  if (displayStopLoss) allPrices.push(displayStopLoss.price);
  
  const minPrice = Math.min(...allPrices) * 0.95;
  const maxPrice = Math.max(...allPrices) * 1.05;
  const priceRange = maxPrice - minPrice;

  // Convert price to Y coordinate
  const priceToY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  // Convert timestamp to X coordinate  
  const timestampToX = (timestamp: number) => {
    const minTime = Math.min(...chartData.map(d => d.timestamp));
    const maxTime = Math.max(...chartData.map(d => d.timestamp));
    const timeRange = maxTime - minTime;
    return ((timestamp - minTime) / timeRange) * chartWidth;
  };

  // Generate SVG path for price line
  const pricePath = chartData.map((point, index) => {
    const x = timestampToX(point.timestamp);
    const y = priceToY(point.price);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className={`bg-gray-900 rounded-lg p-4 border-2 ${displayTakeProfit || displayStopLoss ? 'border-green-500 shadow-xl shadow-green-500/30' : 'border-gray-700'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">{pair} Price Chart</h3>
        <div className="flex flex-col text-sm text-gray-400">
          <span>Current: ${actualCurrentPrice.toFixed(4)}</span>
          {displayTakeProfit && (
            <span className="text-green-400 font-bold text-base">🟢 TP: ${displayTakeProfit.price.toFixed(4)} (+{displayTakeProfit.percentage}%)</span>
          )}
          {displayStopLoss && (
            <span className="text-red-400 font-bold text-base">🔴 SL: ${displayStopLoss.price.toFixed(4)} (-{displayStopLoss.percentage}%)</span>
          )}
        </div>
      </div>
      
      {/* Debug: TP/SL Status Banner */}
      {(displayTakeProfit || displayStopLoss) && (
        <div className="mb-2 p-2 bg-yellow-900/30 border border-yellow-500 rounded text-center">
          <p className="text-yellow-400 font-bold text-sm">
            ⚡ TRADING LEVELS ACTIVE ⚡
          </p>
          {displayTakeProfit && (
            <p className="text-green-400 text-xs">
              Take Profit: ${displayTakeProfit.price.toFixed(4)} ({displayTakeProfit.percentage}% above)
            </p>
          )}
          {displayStopLoss && (
            <p className="text-red-400 text-xs">
              Stop Loss: ${displayStopLoss.price.toFixed(4)} ({displayStopLoss.percentage}% below)
            </p>
          )}
        </div>
      )}
      
      <div className="relative bg-gray-800 rounded-lg p-4" ref={chartRef}>
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Define glowing effects */}
          <defs>
            {/* TP Glow Effect */}
            <filter id="tpGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* SL Glow Effect */}
            <filter id="slGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* Entry Glow Effect */}
            <filter id="entryGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Risk/Reward Zone Shading */}
          {/* Profit Zone (Entry to TP) - 10% green tint */}
          <rect
            x={0}
            y={priceToY(displayTakeProfit.price)}
            width={chartWidth}
            height={Math.abs(priceToY(entryPrice) - priceToY(displayTakeProfit.price))}
            fill="#00FF41"
            fillOpacity="0.08"
          />
          
          {/* Loss Zone (Entry to SL) - 10% red tint */}
          <rect
            x={0}
            y={priceToY(entryPrice)}
            width={chartWidth}
            height={Math.abs(priceToY(displayStopLoss.price) - priceToY(entryPrice))}
            fill="#FF4B4B"
            fillOpacity="0.08"
          />
          
          {/* Price line */}
          <path
            d={pricePath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          
          {/* Entry Point Line - Thin Cyan/White */}
          <line
            x1={0}
            y1={priceToY(entryPrice)}
            x2={chartWidth}
            y2={priceToY(entryPrice)}
            stroke="#00D9FF"
            strokeWidth="1.5"
            strokeDasharray="4,2"
            filter="url(#entryGlow)"
            opacity="0.9"
          />
          
          {/* Take Profit Line - Tactical HUD Style */}
          {displayTakeProfit && (
            <g>
              {/* Glowing TP Line */}
              <line
                x1={0}
                y1={priceToY(displayTakeProfit.price)}
                x2={chartWidth}
                y2={priceToY(displayTakeProfit.price)}
                stroke="#00FF41"
                strokeWidth="2"
                filter="url(#tpGlow)"
                opacity="1"
              />
              
              {/* Pill-shaped HUD label */}
              <g transform={`translate(${chartWidth - 140}, ${priceToY(displayTakeProfit.price) - 18})`}>
                <rect
                  x="0"
                  y="0"
                  width="135"
                  height="30"
                  rx="15"
                  fill="#00FF41"
                  fillOpacity="0.95"
                  stroke="#00FF41"
                  strokeWidth="2"
                  filter="url(#tpGlow)"
                />
                <text
                  x="67.5"
                  y="20"
                  fill="#000000"
                  fontSize="12"
                  fontWeight="900"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  🎯 TP: ${displayTakeProfit.price.toFixed(4)}
                </text>
              </g>
              
              {/* Target reticle at line end */}
              <circle
                cx={chartWidth + 10}
                cy={priceToY(displayTakeProfit.price)}
                r="4"
                fill="#00FF41"
                filter="url(#tpGlow)"
              />
              <circle
                cx={chartWidth + 10}
                cy={priceToY(displayTakeProfit.price)}
                r="8"
                fill="none"
                stroke="#00FF41"
                strokeWidth="1.5"
                filter="url(#tpGlow)"
              />
            </g>
          )}
          
          {/* Stop Loss Line - Tactical Warning Style */}
          {displayStopLoss && (
            <g>
              {/* Glowing SL Line - Dashed */}
              <line
                x1={0}
                y1={priceToY(displayStopLoss.price)}
                x2={chartWidth}
                y2={priceToY(displayStopLoss.price)}
                stroke="#FF4B4B"
                strokeWidth="2"
                strokeDasharray="6,4"
                filter="url(#slGlow)"
                opacity="1"
              />
              
              {/* Pill-shaped HUD label */}
              <g transform={`translate(${chartWidth - 140}, ${priceToY(displayStopLoss.price) - 18})`}>
                <rect
                  x="0"
                  y="0"
                  width="135"
                  height="30"
                  rx="15"
                  fill="#FF4B4B"
                  fillOpacity="0.95"
                  stroke="#FF4B4B"
                  strokeWidth="2"
                  filter="url(#slGlow)"
                />
                <text
                  x="67.5"
                  y="20"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="900"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  ⚠️ SL: ${displayStopLoss.price.toFixed(4)}
                </text>
              </g>
              
              {/* Warning reticle at line end */}
              <path
                d={`M ${chartWidth + 10} ${priceToY(displayStopLoss.price) - 6} L ${chartWidth + 10} ${priceToY(displayStopLoss.price) + 6} M ${chartWidth + 4} ${priceToY(displayStopLoss.price)} L ${chartWidth + 16} ${priceToY(displayStopLoss.price)}`}
                stroke="#FF4B4B"
                strokeWidth="2"
                filter="url(#slGlow)"
              />
            </g>
          )}
          
          {/* Active Price Diamond Marker */}
          <g transform={`translate(${chartWidth - 5}, ${priceToY(actualCurrentPrice)})`}>
            <path
              d="M 0,-6 L 6,0 L 0,6 L -6,0 Z"
              fill="#00D9FF"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              filter="url(#entryGlow)"
            />
          </g>
          
          {/* Price labels on Y-axis */}
          {[minPrice, (minPrice + maxPrice) / 2, maxPrice].map((price, index) => (
            <g key={index}>
              <line
                x1={0}
                y1={priceToY(price)}
                x2={chartWidth}
                y2={priceToY(price)}
                stroke="#374151"
                strokeWidth="1"
                opacity="0.3"
              />
              <text
                x={10}
                y={priceToY(price) - 5}
                fill="#9CA3AF"
                fontSize="10"
              >
                ${price.toFixed(4)}
              </text>
            </g>
          ))}
        </svg>
        
        {/* HUD: Active Position Widget */}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm border-2 border-cyan-400 rounded-lg p-3 shadow-xl shadow-cyan-400/30" style={{minWidth: '220px'}}>
          <div className="flex flex-col gap-2">
            {/* Position Header */}
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-black text-xs tracking-wider uppercase font-mono">
                ⚡ ACTIVE POSITION
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            {/* Position Details */}
            <div className="text-white font-bold text-sm font-mono">
              LONG {pair}
            </div>
            
            {/* PnL Display */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">PnL:</span>
              <span className={`text-2xl font-black font-mono ${pnl >= 0 ? 'text-green-400' : 'text-red-400'} ${pnl >= 0 ? 'drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]' : 'drop-shadow-[0_0_8px_rgba(255,75,75,0.8)]'}`}>
                {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}%
              </span>
            </div>
            
            {/* Risk/Reward Info */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-1">
              <div>
                <div className="text-gray-500">Entry</div>
                <div className="text-cyan-300">${entryPrice.toFixed(4)}</div>
              </div>
              <div>
                <div className="text-gray-500">Current</div>
                <div className="text-white">${actualCurrentPrice.toFixed(4)}</div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-2">
              <button className="flex-1 bg-red-500/20 hover:bg-red-500/40 border border-red-500 text-red-400 text-xs font-bold py-1.5 rounded transition-all backdrop-blur-sm">
                CLOSE
              </button>
              <button className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500 text-cyan-400 text-xs font-bold py-1.5 rounded transition-all backdrop-blur-sm">
                EDIT
              </button>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center space-x-6 mt-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-blue-400 opacity-60 border-dashed border border-blue-400"></div>
            <span className="text-gray-400">Current Price</span>
          </div>
          {displayTakeProfit && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-green-500 border-dashed border border-green-500"></div>
              <span className="text-green-400">Take Profit ({displayTakeProfit.percentage}%)</span>
            </div>
          )}
          {displayStopLoss && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-red-500 border-dashed border border-red-500"></div>
              <span className="text-red-400">Stop Loss ({displayStopLoss.percentage}%)</span>
            </div>
          )}
        </div>
      </div>
      
      {/* TP/SL Summary */}
      {(mockTakeProfit || mockStopLoss) && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
          <h4 className="text-sm font-semibold text-white mb-2">Active Orders</h4>
          <div className="space-y-2">
            {mockTakeProfit && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-400">Take Profit:</span>
                <span className="text-white">${mockTakeProfit.price.toFixed(4)} (+{mockTakeProfit.percentage}%)</span>
              </div>
            )}
            {mockStopLoss && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-red-400">Stop Loss:</span>
                <span className="text-white">${mockStopLoss.price.toFixed(4)} (-{mockStopLoss.percentage}%)</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};