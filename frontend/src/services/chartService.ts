import { ChartData, TimeFrame } from '../components/Chart/PriceChart';
import { UTCTimestamp } from 'lightweight-charts';

// Mock data generation for development
const generateMockCandles = (
  symbol: string, 
  timeframe: TimeFrame, 
  count: number = 100
): ChartData[] => {
  let time: UTCTimestamp = Math.floor(Date.now() / 1000) as UTCTimestamp;
  const candles: ChartData[] = [];
  
  // Determine time increment based on timeframe
  let increment: number;
  switch (timeframe) {
    case '1m':
      increment = 60;
      break;
    case '5m':
      increment = 5 * 60;
      break;
    case '15m':
      increment = 15 * 60;
      break;
    case '1h':
      increment = 60 * 60;
      break;
    case '4h':
      increment = 4 * 60 * 60;
      break;
    case '1d':
      increment = 24 * 60 * 60;
      break;
    case '1w':
      increment = 7 * 24 * 60 * 60;
      break;
    default:
      increment = 60;
  }
  
  // Set base price based on symbol
  let basePrice = symbol.includes('BTC') ? 50000 : 3000;
  let lastClose = basePrice;
  
  // Generate candles
  for (let i = 0; i < count; i++) {
    // Go back in time by decrementing timestamp
    time = (time - increment) as UTCTimestamp;
    
    // Random price movement with some trend
    const volatility = symbol.includes('BTC') ? 200 : 20;
    const changePercent = (Math.random() - 0.5) * 0.2; // -0.1 to 0.1
    const change = lastClose * changePercent;
    
    const open = lastClose;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    // Random volume
    const volume = Math.floor(Math.random() * 1000 + 500) * (symbol.includes('BTC') ? 10 : 1);
    
    candles.push({
      time,
      open,
      high,
      low,
      close,
      volume
    });
    
    lastClose = close;
  }
  
  // Reverse to have chronological order
  return candles.reverse();
};

// Fetch chart data with optional caching
let cachedData: Record<string, { timeframe: TimeFrame, data: ChartData[], timestamp: number }> = {};

export const fetchChartData = async (
  symbol: string, 
  timeframe: TimeFrame
): Promise<ChartData[]> => {
  // Check cache first (valid for 1 minute for short timeframes, longer for others)
  const cacheKey = `${symbol}-${timeframe}`;
  const cachedItem = cachedData[cacheKey];
  const currentTime = Date.now();
  
  // Cache duration depends on timeframe (shorter timeframes need more frequent updates)
  let cacheDuration = 60000; // 1 minute default
  if (timeframe === '1h' || timeframe === '4h') {
    cacheDuration = 300000; // 5 minutes
  } else if (timeframe === '1d' || timeframe === '1w') {
    cacheDuration = 3600000; // 1 hour
  }
  
  if (cachedItem && currentTime - cachedItem.timestamp < cacheDuration) {
    return cachedItem.data;
  }
  
  // In a real app, this would make an API call
  // For now, generate mock data
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    // Generate mock data
    const data = generateMockCandles(symbol, timeframe);
    
    // Update cache
    cachedData[cacheKey] = {
      timeframe,
      data,
      timestamp: currentTime
    };
    
    return data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return [];
  }
};

// Calculate indicator values
export const calculateMA = (data: ChartData[], period: number): LineData[] => {
  const result: LineData[] = [];
  
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    
    result.push({
      time: data[i].time,
      value: sum / period
    });
  }
  
  return result;
};

// Add other indicator calculations as needed (EMA, MACD, RSI, etc.)
export interface LineData {
  time: UTCTimestamp;
  value: number;
}

// Add update functionality to append new candles in real-time
export const appendNewCandle = (
  existingData: ChartData[], 
  newCandle: ChartData
): ChartData[] => {
  // Check if we need to update the last candle or add a new one
  if (existingData.length > 0 && existingData[existingData.length - 1].time === newCandle.time) {
    // Update the last candle
    const updatedData = [...existingData];
    updatedData[updatedData.length - 1] = newCandle;
    return updatedData;
  } else {
    // Add a new candle
    return [...existingData, newCandle];
  }
}; 