import React from 'react';

const Portfolio: React.FC = () => {
  // Mock data for portfolio
  const balance = 25000;
  
  const positions = [
    {
      id: '1',
      symbol: 'BTC-USDT',
      side: 'long',
      size: 1,
      entryPrice: 48000,
      markPrice: 50010,
      leverage: 10,
      liquidationPrice: 43200,
      pnl: 2010,
      pnlPercentage: 4.19,
      collateral: 4800
    },
    {
      id: '2',
      symbol: 'ETH-USDT',
      side: 'short',
      size: 10,
      entryPrice: 3200,
      markPrice: 3005,
      leverage: 5,
      liquidationPrice: 3840,
      pnl: 1950,
      pnlPercentage: 6.09,
      collateral: 6400
    }
  ];
  
  const orders = [
    {
      id: '101',
      symbol: 'BTC-USDT',
      side: 'buy',
      type: 'limit',
      price: 48500,
      size: 0.5,
      filled: 0,
      status: 'open',
      createdAt: '2023-05-15T10:30:00Z'
    },
    {
      id: '102',
      symbol: 'ETH-USDT',
      side: 'sell',
      type: 'limit',
      price: 3300,
      size: 5,
      filled: 0,
      status: 'open',
      createdAt: '2023-05-15T11:15:00Z'
    },
    {
      id: '103',
      symbol: 'BTC-USDT',
      side: 'buy',
      type: 'market',
      price: 49200,
      size: 0.25,
      filled: 0.25,
      status: 'filled',
      createdAt: '2023-05-15T09:45:00Z'
    }
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Portfolio</h1>
      
      <div className="mb-8 bg-gray-900 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Account Balance</h2>
          <div className="text-2xl font-bold">${balance.toLocaleString()}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Available Balance</h3>
            <p className="text-xl">${(balance - positions.reduce((acc, pos) => acc + pos.collateral, 0)).toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Used Collateral</h3>
            <p className="text-xl">${positions.reduce((acc, pos) => acc + pos.collateral, 0).toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Open Positions</h2>
        
        {positions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 rounded-lg">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 text-left">Symbol</th>
                  <th className="py-3 px-4 text-left">Side</th>
                  <th className="py-3 px-4 text-right">Size</th>
                  <th className="py-3 px-4 text-right">Entry Price</th>
                  <th className="py-3 px-4 text-right">Mark Price</th>
                  <th className="py-3 px-4 text-right">Leverage</th>
                  <th className="py-3 px-4 text-right">Liq. Price</th>
                  <th className="py-3 px-4 text-right">PnL</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.id} className="border-b border-gray-800">
                    <td className="py-3 px-4 font-medium">{position.symbol}</td>
                    <td className={`py-3 px-4 ${position.side === 'long' ? 'text-green-500' : 'text-red-500'}`}>
                      {position.side.charAt(0).toUpperCase() + position.side.slice(1)}
                    </td>
                    <td className="py-3 px-4 text-right">{position.size}</td>
                    <td className="py-3 px-4 text-right">${position.entryPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">${position.markPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{position.leverage}x</td>
                    <td className="py-3 px-4 text-right">${position.liquidationPrice.toLocaleString()}</td>
                    <td className={`py-3 px-4 text-right ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${position.pnl.toLocaleString()} ({position.pnlPercentage.toFixed(2)}%)
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">Close</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <p className="text-gray-400">You don't have any open positions</p>
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Open Orders</h2>
        
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 rounded-lg">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 text-left">Symbol</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Side</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Size</th>
                  <th className="py-3 px-4 text-right">Filled</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-800">
                    <td className="py-3 px-4 font-medium">{order.symbol}</td>
                    <td className="py-3 px-4">
                      {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
                    </td>
                    <td className={`py-3 px-4 ${order.side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                      {order.side.charAt(0).toUpperCase() + order.side.slice(1)}
                    </td>
                    <td className="py-3 px-4 text-right">${order.price.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{order.size}</td>
                    <td className="py-3 px-4 text-right">{order.filled}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'filled' ? 'bg-green-900 text-green-300' : 
                        order.status === 'open' ? 'bg-blue-900 text-blue-300' : 
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      {order.status === 'open' && (
                        <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <p className="text-gray-400">You don't have any open orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio; 