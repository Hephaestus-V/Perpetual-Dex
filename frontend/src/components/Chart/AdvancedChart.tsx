import React, { useState, useEffect, useCallback } from 'react';
import PriceChart, { ChartData, TimeFrame } from './PriceChart.tsx';
import ChartToolbar, { IndicatorType } from './ChartToolbar.tsx';
import { fetchChartData, LineData, calculateMA } from '../../services/chartService.ts';
import { ISeriesApi, UTCTimestamp } from 'lightweight-charts';

interface AdvancedChartProps {
  symbol: string;
  initialTimeframe?: TimeFrame;
  height?: number;
  darkMode?: boolean;
}

const AdvancedChart: React.FC<AdvancedChartProps> = ({
  symbol,
  initialTimeframe = '1h',
  height = 500,
  darkMode = true,
}) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>(initialTimeframe);
  const [chartType, setChartType] = useState<'candles' | 'line' | 'area'>('candles');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Active indicators
  const [activeIndicators, setActiveIndicators] = useState<{
    type: IndicatorType;
    series: ISeriesApi<any> | null;
    settings: Record<string, number>;
  }[]>([]);
  
  // Chart and series references
  const [chartRef, setChartRef] = useState<any>(null);

  // Load chart data
  const loadChartData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchChartData(symbol, timeframe);
      setChartData(data);
    } catch (err) {
      setError('Failed to load chart data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [symbol, timeframe]);

  // Initial data load
  useEffect(() => {
    loadChartData();
    
    // Set up periodic updates for live data (only for shorter timeframes)
    let intervalId: NodeJS.Timeout | null = null;
    
    if (['1m', '5m', '15m'].includes(timeframe)) {
      intervalId = setInterval(() => {
        loadChartData();
      }, 30000); // Update every 30 seconds
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [loadChartData, timeframe]);

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: TimeFrame) => {
    setTimeframe(newTimeframe);
  };

  // Handle chart type change
  const handleChartTypeChange = (type: 'candles' | 'line' | 'area') => {
    setChartType(type);
  };

  // Handle indicator toggle
  const handleToggleIndicator = (
    indicator: IndicatorType, 
    active: boolean, 
    settings?: Record<string, number>
  ) => {
    if (active && chartRef && chartData.length > 0) {
      // Add indicator
      const newIndicator = {
        type: indicator,
        series: null, // Will be set by the chart component
        settings: settings || {}
      };
      
      setActiveIndicators([...activeIndicators, newIndicator]);
    } else {
      // Remove indicator
      setActiveIndicators(activeIndicators.filter(ind => ind.type !== indicator));
    }
  };

  // Loading state
  if (loading && chartData.length === 0) {
    return (
      <div 
        className="bg-gray-900 rounded-lg p-4 flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="text-gray-400 animate-pulse">Loading chart data...</div>
      </div>
    );
  }

  // Error state
  if (error && chartData.length === 0) {
    return (
      <div 
        className="bg-gray-900 rounded-lg p-4 flex flex-col items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="text-red-500 mb-2">Error loading chart data</div>
        <button 
          className="px-3 py-1 bg-blue-600 rounded-md text-sm"
          onClick={() => loadChartData()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <ChartToolbar 
        onToggleIndicator={handleToggleIndicator}
        onChartTypeChange={handleChartTypeChange}
        chartType={chartType}
      />
      
      <PriceChart
        symbol={symbol}
        data={chartData}
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        height={height}
        showVolume={true}
        darkMode={darkMode}
      />
      
      {/* Market stats below chart */}
      {chartData.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-gray-400">O</div>
            <div>${chartData[chartData.length - 1].open.toFixed(2)}</div>
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-gray-400">H</div>
            <div>${chartData[chartData.length - 1].high.toFixed(2)}</div>
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-gray-400">L</div>
            <div>${chartData[chartData.length - 1].low.toFixed(2)}</div>
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-gray-400">C</div>
            <div>${chartData[chartData.length - 1].close.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedChart; 