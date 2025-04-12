import React from 'react';

// Simplified dashboard with mock data
const Dashboard: React.FC = () => {
  // Mock market data
  const markets = [
    {
      symbol: 'BTC-USDT',
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <tr key={market.symbol} className="border-t border-gray-700">
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
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Trading Volume</h2>
          <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Volume Chart Would Go Here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 