// Order types
export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  price: number;
  leverage: number;
  type: 'market' | 'limit';
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  userId: string;
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  price: number;
  type: 'market' | 'limit';
  leverage: number;
}

// Position types
export interface Position {
  id: string;
  userId: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  leverage: number;
  liquidationPrice: number;
  unrealizedPnl: number;
  createdAt: string;
  updatedAt: string;
}

// Market types
export interface Market {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  indexPrice: number;
  markPrice: number;
  fundingRate: number;
  volume24h: number;
  openInterest: number;
}

// User types
export interface User {
  id: string;
  email: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
} 