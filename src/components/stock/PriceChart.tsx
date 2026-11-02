import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const PriceChart = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
    } p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isDark ? 'bg-green-500/20' : 'bg-green-50'
          }`}>
            <TrendingUp className={isDark ? 'text-green-400' : 'text-green-600'} />
          </div>
          <h2 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Price History
          </h2>
        </div>
        
        <div className="flex gap-2">
          {['1D', '1W', '1M', '1Y', 'ALL'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="aspect-[16/9] w-full bg-gradient-to-b from-blue-500/10 to-transparent rounded-lg flex items-center justify-center">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Chart visualization would go here
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className={`w-4 h-4 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <span className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};