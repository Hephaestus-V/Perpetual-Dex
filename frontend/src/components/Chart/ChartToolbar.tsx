import React, { useState } from 'react';

// Define available indicators
export type IndicatorType = 'MA' | 'EMA' | 'MACD' | 'RSI' | 'BB';

interface IndicatorOption {
  type: IndicatorType;
  name: string;
  active: boolean;
  settings?: Record<string, number>;
}

interface ChartToolbarProps {
  onToggleIndicator: (indicator: IndicatorType, active: boolean, settings?: Record<string, number>) => void;
  onChartTypeChange: (type: 'candles' | 'line' | 'area') => void;
  chartType: 'candles' | 'line' | 'area';
}

const ChartToolbar: React.FC<ChartToolbarProps> = ({
  onToggleIndicator,
  onChartTypeChange,
  chartType,
}) => {
  const [showIndicators, setShowIndicators] = useState(false);
  const [indicators, setIndicators] = useState<IndicatorOption[]>([
    { type: 'MA', name: 'Moving Average', active: false, settings: { period: 20 } },
    { type: 'EMA', name: 'Exponential MA', active: false, settings: { period: 20 } },
    { type: 'MACD', name: 'MACD', active: false, settings: { fast: 12, slow: 26, signal: 9 } },
    { type: 'RSI', name: 'RSI', active: false, settings: { period: 14 } },
    { type: 'BB', name: 'Bollinger Bands', active: false, settings: { period: 20, deviation: 2 } },
  ]);

  const toggleIndicator = (index: number) => {
    const newIndicators = [...indicators];
    newIndicators[index].active = !newIndicators[index].active;
    setIndicators(newIndicators);
    
    const indicator = newIndicators[index];
    onToggleIndicator(indicator.type, indicator.active, indicator.settings);
  };

  return (
    <div className="flex items-center gap-2 py-2 px-3 bg-gray-800 rounded-lg mb-2">
      {/* Chart Type Selector */}
      <div className="flex border border-gray-700 rounded-md overflow-hidden">
        <button
          className={`px-2 py-1 text-xs ${
            chartType === 'candles' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => onChartTypeChange('candles')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          className={`px-2 py-1 text-xs ${
            chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => onChartTypeChange('line')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2h14a1 1 0 100-2H3zm0 6a1 1 0 000 2h14a1 1 0 100-2H3zm0 6a1 1 0 100 2h14a1 1 0 100-2H3z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          className={`px-2 py-1 text-xs ${
            chartType === 'area' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => onChartTypeChange('area')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Drawing Tools Placeholder */}
      <button className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Indicator Selector */}
      <div className="relative">
        <button 
          className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-md"
          onClick={() => setShowIndicators(!showIndicators)}
        >
          Indicators
        </button>
        
        {showIndicators && (
          <div className="absolute top-full left-0 mt-1 z-10 bg-gray-800 w-44 rounded-md shadow-lg p-2">
            {indicators.map((indicator, index) => (
              <div key={indicator.type} className="flex items-center py-1">
                <input
                  type="checkbox"
                  id={`indicator-${indicator.type}`}
                  checked={indicator.active}
                  onChange={() => toggleIndicator(index)}
                  className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <label 
                  htmlFor={`indicator-${indicator.type}`}
                  className="text-sm text-gray-300"
                >
                  {indicator.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center space-x-2">
        <button className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChartToolbar; 