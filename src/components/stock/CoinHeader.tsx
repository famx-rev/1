import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const CoinHeader = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          isDark ? 'text-white dark-glow-sm' : 'text-gray-900'
        }`}>
          7EA Coin
        </h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Official cryptocurrency of 7EA Platform
        </p>
      </div>
      <button 
        className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
          isDark
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        } transition-all duration-300`}
      >
        <RefreshCw className="w-4 h-4" />
        Refresh
      </button>
    </div>
  );
};