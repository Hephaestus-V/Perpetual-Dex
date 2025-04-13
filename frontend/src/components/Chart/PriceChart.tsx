import React, { useEffect, useRef, useState } from 'react';
import { 
  createChart, 
  CrosshairMode, 
  IChartApi, 
  ISeriesApi, 
  CandlestickData, 
  LineData,
  UTCTimestamp,
  ChartOptions,
  DeepPartial,
  HistogramSeriesPartialOptions,
} from 'lightweight-charts';

// Define chart data interfaces
export interface ChartData {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// Define timeframes
export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';

interface PriceChartProps {
  symbol: string;
  data: ChartData[];
  timeframe: TimeFrame;
  onTimeframeChange: (timeframe: TimeFrame) => void;
  height?: number;
  width?: string;
  showVolume?: boolean;
  darkMode?: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({
  symbol,
  data,
  timeframe,
  onTimeframeChange,
  height = 400,
  width = '100%',
  showVolume = true,
  darkMode = true,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [candleSeries, setCandleSeries] = useState<ISeriesApi<'Candlestick'> | null>(null);
  const [volumeSeries, setVolumeSeries] = useState<ISeriesApi<'Histogram'> | null>(null);
  
  // Available timeframes
  const timeframes: TimeFrame[] = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'];

  // Color theme based on dark mode
  const getChartOptions = (): DeepPartial<ChartOptions> => {
    return {
      width: chartContainerRef.current?.clientWidth || 600,
      height: height,
      layout: {
        background: { color: darkMode ? '#1A202C' : '#FFFFFF' },
        textColor: darkMode ? '#D1D5DB' : '#374151',
      },
      grid: {
        vertLines: { color: darkMode ? '#2D3748' : '#E5E7EB' },
        horzLines: { color: darkMode ? '#2D3748' : '#E5E7EB' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: darkMode ? '#4B5563' : '#E5E7EB',
      },
      timeScale: {
        borderColor: darkMode ? '#4B5563' : '#E5E7EB',
        timeVisible: true,
        secondsVisible: false,
      },
    };
  };

  // Initialize chart
  useEffect(() => {
    if (chartContainerRef.current) {
      const newChart = createChart(chartContainerRef.current, getChartOptions());
      
      // Create candlestick series
      const newCandleSeries = newChart.addCandlestickSeries({
        upColor: '#10B981',
        downColor: '#EF4444',
        borderVisible: false,
        wickUpColor: '#10B981',
        wickDownColor: '#EF4444',
      });
      
      // Add volume series if enabled
      if (showVolume) {
        // Update chart layout
        newChart.applyOptions({ 
          layout: { 
            background: { color: darkMode ? '#1A202C' : '#FFFFFF' },
          },
        });
        
        // Add histogram series for volume
        const newVolumeSeries = newChart.addHistogramSeries({
          color: '#3B82F6',
          priceFormat: {
            type: 'volume',
          },
          priceScaleId: 'volume',
        });
        
        // Configure volume scale margins
        newVolumeSeries.priceScale().applyOptions({
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
        });
        
        setVolumeSeries(newVolumeSeries);
      }

      // Set state
      setChart(newChart);
      setCandleSeries(newCandleSeries);

      // Clean up on component unmount
      return () => {
        newChart.remove();
      };
    }
  }, [darkMode, height, showVolume]);

  // Update data when it changes
  useEffect(() => {
    if (candleSeries && data.length > 0) {
      const candleData = data.map(item => ({
        time: item.time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));
      
      candleSeries.setData(candleData);
      
      // If volume series is enabled and data has volume
      if (volumeSeries && data[0].volume !== undefined) {
        const volumeData = data.map(item => ({
          time: item.time,
          value: item.volume || 0,
          color: item.close >= item.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
        }));
        
        volumeSeries.setData(volumeData);
      }
      
      // Fit content to view all data
      if (chart) {
        chart.timeScale().fitContent();
      }
    }
  }, [data, candleSeries, volumeSeries, chart]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chart]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-semibold">{symbol}</div>
        <div className="flex space-x-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              className={`px-2 py-1 text-xs rounded ${
                timeframe === tf 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => onTimeframeChange(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div 
        ref={chartContainerRef} 
        className="w-full rounded-lg overflow-hidden"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default PriceChart; 