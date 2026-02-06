'use client';

import React, { useState } from 'react';

interface TradingPanelProps {
  currentPrice: number;
  onPlaceOrder: (order: {
    type: 'market' | 'limit';
    side: 'buy' | 'sell';
    quantity: number;
    price?: number;
  }) => void;
}

export default function TradingPanel({ currentPrice, onPlaceOrder }: TradingPanelProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>(currentPrice.toFixed(4));
  const [loading, setLoading] = useState(false);

  // Update price when current price changes
  React.useEffect(() => {
    if (orderType === 'market') {
      setPrice(currentPrice.toFixed(4));
    }
  }, [currentPrice, orderType]);

  const handlePlaceOrder = async () => {
    if (!quantity || (orderType === 'limit' && !price)) return;

    setLoading(true);
    try {
      await onPlaceOrder({
        type: orderType,
        side,
        quantity: parseFloat(quantity),
        price: orderType === 'limit' ? parseFloat(price) : undefined
      });
      
      // Reset form after successful order
      setQuantity('');
      if (orderType === 'market') {
        setPrice(currentPrice.toFixed(4));
      }
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    const prc = parseFloat(price) || 0;
    return (qty * prc).toFixed(4);
  };

  const getMaxQuantity = () => {
    // This would come from actual balance in real implementation
    return side === 'buy' ? '10000' : '5000';
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Place Order</h3>
        
        {/* Order Type Tabs */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setOrderType('market')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              orderType === 'market'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType('limit')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              orderType === 'limit'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Limit
          </button>
        </div>

        {/* Buy/Sell Toggle */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setSide('buy')}
            className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
              side === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Buy DEEP
          </button>
          <button
            onClick={() => setSide('sell')}
            className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
              side === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Sell DEEP
          </button>
        </div>
      </div>

      {/* Order Form */}
      <div className="p-4 space-y-4">
        {/* Price Input (for limit orders) */}
        {orderType === 'limit' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Price (SUI per DEEP)
            </label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                placeholder="0.0000"
                step="0.0001"
              />
              <span className="absolute right-3 top-2 text-gray-400 text-sm">SUI</span>
            </div>
          </div>
        )}

        {/* Market Price Display (for market orders) */}
        {orderType === 'market' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Market Price
            </label>
            <div className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
              <span className="text-white font-mono">{currentPrice.toFixed(4)} SUI</span>
              <span className="text-gray-400 text-sm ml-2">per DEEP</span>
            </div>
          </div>
        )}

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Quantity (DEEP)
          </label>
          <div className="relative">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none pr-16"
              placeholder="0.00"
              step="0.01"
            />
            <button
              onClick={() => setQuantity(getMaxQuantity())}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 text-sm"
            >
              MAX
            </button>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Available: {getMaxQuantity()} {side === 'buy' ? 'SUI' : 'DEEP'}
          </div>
        </div>

        {/* Total */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Total (SUI)
          </label>
          <div className="bg-gray-800 border border-gray-600 rounded px-3 py-2">
            <span className="text-white font-mono">{calculateTotal()}</span>
            <span className="text-gray-400 text-sm ml-2">SUI</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !quantity || (orderType === 'limit' && !price)}
          className={`w-full py-3 rounded font-medium transition-colors ${
            side === 'buy'
              ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-800'
              : 'bg-red-600 hover:bg-red-700 disabled:bg-red-800'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Placing Order...
            </div>
          ) : (
            `${side === 'buy' ? 'Buy' : 'Sell'} DEEP`
          )}
        </button>

        {/* Order Summary */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Order Type:</span>
            <span className="text-white capitalize">{orderType}</span>
          </div>
          <div className="flex justify-between">
            <span>Fee:</span>
            <span className="text-white">0.1%</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Fee:</span>
            <span className="text-white">{(parseFloat(calculateTotal()) * 0.001).toFixed(4)} SUI</span>
          </div>
        </div>
      </div>
    </div>
  );
}