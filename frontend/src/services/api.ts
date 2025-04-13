import axios from 'axios';
import { Order, CreateOrderRequest, Position, Market, User } from '../types';

const API_URL = process.env.REACT_APP_API_URL || '';

// Order API
export const createOrder = async (order: CreateOrderRequest): Promise<Order> => {
  const response = await axios.post(`${API_URL}/api/orders/create`, order);
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await axios.get(`${API_URL}/api/orders/get?id=${id}`);
  return response.data;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const response = await axios.get(`${API_URL}/api/orders/user?userId=${userId}`);
  return response.data;
};

// Mock data for development
export const getMarkets = async (): Promise<Market[]> => {
  // In production, this would call a real API endpoint
  return [
    {
      symbol: 'BTC-PERP',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      indexPrice: 50000,
      markPrice: 50010,
      fundingRate: 0.0001,
      volume24h: 100000000,
      openInterest: 500000000
    },
    {
      symbol: 'ETH-USDT',
      baseAsset: 'ETH',
      quoteAsset: 'USDT',
      indexPrice: 3000,
      markPrice: 3005,
      fundingRate: 0.0002,
      volume24h: 50000000,
      openInterest: 200000000
    }
  ];
};

export const getUserPositions = async (userId: string): Promise<Position[]> => {
  // In production, this would call a real API endpoint
  return [
    {
      id: '1',
      userId,
      symbol: 'BTC-PERP',
      side: 'long',
      size: 1,
      entryPrice: 48000,
      leverage: 10,
      liquidationPrice: 43200,
      unrealizedPnl: 2000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      userId,
      symbol: 'ETH-USDT',
      side: 'short',
      size: 10,
      entryPrice: 3200,
      leverage: 5,
      liquidationPrice: 3840,
      unrealizedPnl: 1950,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

export const getUserBalance = async (userId: string): Promise<User> => {
  // In production, this would call a real API endpoint
  return {
    id: userId,
    email: 'user@example.com',
    balance: 100000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}; 