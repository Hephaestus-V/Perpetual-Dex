import React, { useState } from 'react';
import AdvancedChart from '../components/Chart/AdvancedChart.tsx';
import { Link } from 'react-router-dom';

// Simplified dashboard with mock data
const Dashboard: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState('BTC-PERP');
  
  // Mock market data
  const markets = [
    {
      symbol: 'BTC-PERP',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      markPrice: 50010,
      fundingRate: 0.0001,
      openInterest: 500000000,
      volume24h: 100000000
    },
    {
      symbol: 'ETH-USDT',
      baseAsset: 'ETH',
      quoteAsset: 'USDT',
      markPrice: 3005,
      fundingRate: 0.0002,
      openInterest: 200000000,
      volume24h: 50000000
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <AdvancedChart 
            symbol={selectedMarket} 
            initialTimeframe="1d"
            height={400}
          />
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Markets</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left">Symbol</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Funding Rate</th>
                </tr>
              </thead>
              <tbody>
                {markets.map((market) => (
                  <tr 
                    key={market.symbol} 
                    className={`border-t border-gray-700 cursor-pointer ${
                      market.symbol === selectedMarket ? 'bg-gray-700' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedMarket(market.symbol)}
                  >
                    <td className="py-3 px-4 font-medium">{market.symbol}</td>
                    <td className="py-3 px-4 text-right">${market.markPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={market.fundingRate > 0 ? 'text-green-500' : 'text-red-500'}>
                        {(market.fundingRate * 100).toFixed(4)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Link 
              to="/trade" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
            >
              Trade Now
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Market Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-gray-400">24h Volume</div>
              <div className="text-lg font-semibold">
                ${(markets.reduce((sum, m) => sum + m.volume24h, 0) / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-gray-400">Open Interest</div>
              <div className="text-lg font-semibold">
                ${(markets.reduce((sum, m) => sum + m.openInterest, 0) / 1000000).toFixed(2)}M
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-gray-400">Active Traders</div>
              <div className="text-lg font-semibold">5,243</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-gray-400">Avg Funding Rate</div>
              <div className="text-lg font-semibold text-green-500">
                {(markets.reduce((sum, m) => sum + m.fundingRate, 0) / markets.length * 100).toFixed(4)}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Trade History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left">Symbol</th>
                  <th className="py-3 px-4 text-left">Side</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="py-3 px-4 font-medium">BTC-PERP</td>
                  <td className="py-3 px-4 text-green-500">Buy</td>
                  <td className="py-3 px-4 text-right">$50,005</td>
                  <td className="py-3 px-4 text-right">0.1</td>
                  <td className="py-3 px-4 text-right text-gray-400">1 min ago</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="py-3 px-4 font-medium">ETH-USDT</td>
                  <td className="py-3 px-4 text-red-500">Sell</td>
                  <td className="py-3 px-4 text-right">$3,010</td>
                  <td className="py-3 px-4 text-right">2.5</td>
                  <td className="py-3 px-4 text-right text-gray-400">3 mins ago</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="py-3 px-4 font-medium">BTC-PERP</td>
                  <td className="py-3 px-4 text-green-500">Buy</td>
                  <td className="py-3 px-4 text-right">$49,980</td>
                  <td className="py-3 px-4 text-right">0.25</td>
                  <td className="py-3 px-4 text-right text-gray-400">5 mins ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 