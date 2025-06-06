import React, { useState } from 'react';
import AdvancedChart from '../components/Chart/AdvancedChart.tsx';

const Trade: React.FC = () => {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [leverage, setLeverage] = useState<string>('5');
  
  // Mock market data
  const selectedMarket = {
    symbol: 'BTC-PERP',
    markPrice: 50010,
    bestAsk: 50015,
    bestBid: 50005,
    dayChange: '+2.5%',
    dayHigh: 51200,
    dayLow: 49800,
    dayVolume: '1.2B'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted:', {
      market: selectedMarket.symbol,
      type: orderType,
      side,
      price: orderType === 'market' ? selectedMarket.markPrice : parseFloat(price),
      amount: parseFloat(amount),
      leverage: parseInt(leverage, 10)
    });
    
    // Reset form
    setAmount('');
    if (orderType === 'limit') {
      setPrice('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Market Info and Chart */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">BTC-PERP</h2>
          <div className="text-xl font-semibold">${selectedMarket.markPrice.toLocaleString()}</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-400">24h Change</div>
            <div className="text-green-500">{selectedMarket.dayChange}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-400">24h High</div>
            <div>${selectedMarket.dayHigh.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-400">24h Low</div>
            <div>${selectedMarket.dayLow.toLocaleString()}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-400">24h Volume</div>
            <div>{selectedMarket.dayVolume}</div>
          </div>
        </div>
        
        {/* Advanced Chart Component */}
        <AdvancedChart 
          symbol={selectedMarket.symbol} 
          initialTimeframe="1h"
          height={400}
        />
      </div>
      
      {/* Order Form */}
      <div className="bg-gray-900 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Place Order</h2>
        
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 rounded-l-lg ${side === 'buy' ? 'bg-green-600' : 'bg-gray-700'}`}
            onClick={() => setSide('buy')}
          >
            Buy
          </button>
          <button
            className={`flex-1 py-2 rounded-r-lg ${side === 'sell' ? 'bg-red-600' : 'bg-gray-700'}`}
            onClick={() => setSide('sell')}
          >
            Sell
          </button>
        </div>
        
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 rounded-l-lg ${orderType === 'market' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setOrderType('market')}
          >
            Market
          </button>
          <button
            className={`flex-1 py-2 rounded-r-lg ${orderType === 'limit' ? 'bg-blue-600' : 'bg-gray-700'}`}
            onClick={() => setOrderType('limit')}
          >
            Limit
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {orderType === 'limit' && (
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <div className="relative">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-gray-800 w-full rounded-lg py-2 px-3 pr-12"
                  placeholder="0.00"
                  step="any"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400">USDT</span>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-800 w-full rounded-lg py-2 px-3 pr-12"
                placeholder="0.00"
                step="any"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400">BTC</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Leverage</label>
            <div className="mb-2">
              <input
                type="range"
                min="1"
                max="100"
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">1x</span>
              <span className="text-sm font-medium">{leverage}x</span>
              <span className="text-sm text-gray-400">100x</span>
            </div>
          </div>
          
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold text-white ${
              side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {side === 'buy' ? 'Buy' : 'Sell'} {orderType === 'market' ? 'Market' : 'Limit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Trade; 