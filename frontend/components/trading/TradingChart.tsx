'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { useInterval } from 'react-use';

interface PriceData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingChartProps {
  symbol: string;
  height?: number;
  theme?: 'light' | 'dark';
}

export default function TradingChart({ symbol, height = 400, theme = 'dark' }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    try {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: {
            type: ColorType.Solid,
            color: theme === 'dark' ? '#131722' : '#FFFFFF',
          },
          textColor: theme === 'dark' ? '#DDD' : '#333',
        },
        grid: {
          vertLines: {
            color: theme === 'dark' ? '#2B2B43' : '#E0E0E0',
          },
          horzLines: {
            color: theme === 'dark' ? '#2B2B43' : '#E0E0E0',
          },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: theme === 'dark' ? '#485c7b' : '#C0C0C0',
          textColor: theme === 'dark' ? '#DDD' : '#333',
        },
        timeScale: {
          borderColor: theme === 'dark' ? '#485c7b' : '#C0C0C0',
          textColor: theme === 'dark' ? '#DDD' : '#333',
          timeVisible: true,
          secondsVisible: false,
        },
        width: chartContainerRef.current.clientWidth,
        height,
      });

      console.log('Chart created:', chart);
      console.log('Available methods:', Object.getOwnPropertyNames(chart));

      // Add candlestick series
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#00ff88',
        downColor: '#ff4976',
        borderUpColor: '#00ff88',
        borderDownColor: '#ff4976',
        wickUpColor: '#00ff88',
        wickDownColor: '#ff4976',
      });

      // Add volume series
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // right scale
        scaleMargins: {
          top: 0.7,
          bottom: 0,
        },
      });

      chartRef.current = chart;
      candlestickSeriesRef.current = candlestickSeries;
      volumeSeriesRef.current = volumeSeries;

      // Load initial data
      loadChartData();

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current && chart) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, [theme, height]);

  // Generate mock data for SUI/DEEP trading
  const generateMockData = (): PriceData[] => {
    const data: PriceData[] = [];
    const now = Math.floor(Date.now() / 1000);
    let currentPrice = 0.85; // Starting price for SUI/DEEP
    
    for (let i = 100; i >= 0; i--) {
      const time = now - (i * 300); // 5-minute intervals
      const volatility = 0.02;
      const change = (Math.random() - 0.5) * volatility;
      
      const open = currentPrice;
      const close = Math.max(0.01, currentPrice + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.random() * 100000 + 10000;
      
      data.push({
        time,
        open,
        high,
        low,
        close,
        volume
      });
      
      currentPrice = close;
    }
    
    setCurrentPrice(currentPrice);
    setPriceChange(((currentPrice - data[0].open) / data[0].open) * 100);
    return data;
  };

  const loadChartData = async () => {
    try {
      // TODO: Replace with actual DeepBook API call
      const mockData = generateMockData();
      
      if (candlestickSeriesRef.current && volumeSeriesRef.current) {
        const candleData = mockData.map(d => ({
          time: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close
        }));
        
        const volumeData = mockData.map(d => ({
          time: d.time,
          value: d.volume,
          color: d.close >= d.open ? '#00ff8840' : '#ff497640'
        }));

        candlestickSeriesRef.current.setData(candleData);
        volumeSeriesRef.current.setData(volumeData);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  // Update chart every 5 seconds with new data
  useInterval(() => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current) return;
    
    const now = Math.floor(Date.now() / 1000);
    const lastPrice = currentPrice || 0.85;
    const change = (Math.random() - 0.5) * 0.01;
    const newPrice = Math.max(0.01, lastPrice + change);
    
    const newCandle = {
      time: now,
      open: lastPrice,
      high: Math.max(lastPrice, newPrice) * (1 + Math.random() * 0.005),
      low: Math.min(lastPrice, newPrice) * (1 - Math.random() * 0.005),
      close: newPrice
    };
    
    const newVolume = {
      time: now,
      value: Math.random() * 10000 + 1000,
      color: newPrice >= lastPrice ? '#00ff8840' : '#ff497640'
    };

    candlestickSeriesRef.current.update(newCandle);
    volumeSeriesRef.current.update(newVolume);
    
    setCurrentPrice(newPrice);
    setPriceChange(((newPrice - lastPrice) / lastPrice) * 100);
  }, 5000);

  return (
    <div className="w-full">
      {/* Price Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-white">{symbol}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              {currentPrice?.toFixed(4) || '---'}
            </span>
            <span className={`text-sm px-2 py-1 rounded ${
              priceChange >= 0 ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'
            }`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div>24h High: <span className="text-white">{(currentPrice! * 1.05)?.toFixed(4)}</span></div>
          <div>24h Low: <span className="text-white">{(currentPrice! * 0.95)?.toFixed(4)}</span></div>
          <div>Volume: <span className="text-white">2.4M</span></div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div 
        ref={chartContainerRef} 
        className="w-full"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}