import React from 'react';
import { TrendingUp, TrendingDown, Loader } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CoinStatsProps {
  balance: string;
  value: string;
  purchasePrice: string;
  profit: string;
  profitPercentage: string;
  loading: boolean;
  error?: string;
}

export const CoinStats: React.FC<CoinStatsProps> = ({
  balance,
  value,
  purchasePrice,
  profit,
  profitPercentage,
  loading,
  error
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isProfit = !profit.startsWith('-');

  if (loading) {
    return (
      <div className={`rounded-2xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      } p-6 flex items-center justify-center min-h-[300px]`}>
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-2xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      } p-6 flex items-center justify-center min-h-[300px]`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
    } p-6`}>
      <div className="flex items-center gap-4 mb-6">
        <img 
          src="https://raw.githubusercontent.com/7054company/7eax/refs/heads/master/logo1.png" 
          alt="7EA Coin" 
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            7EA Coin (7EA)
          </h2>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              ${value}
            </span>
            <span className={`flex items-center text-sm font-medium ${
              isProfit ? 'text-green-500' : 'text-red-500'
            }`}>
              {isProfit ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {profitPercentage}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-white/5' : 'bg-gray-50'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Your Balance</p>
              <p className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{balance} 7EA</p>
            </div>
            <div className="text-right">
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Value</p>
              <p className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>${value}</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${
          isDark ? 'bg-white/5' : 'bg-gray-50'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Purchase Price</p>
              <p className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>${purchasePrice}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Profit/Loss</p>
              <div className="flex items-center justify-end gap-1">
                {isProfit ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <p className={`font-medium ${
                  isProfit ? 'text-green-500' : 'text-red-500'
                }`}>
                  ${profit} ({profitPercentage}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Market Cap', value: '$10M' },
          { label: 'Volume (24h)', value: '$500K' },
          { label: 'Circulating Supply', value: '1M 7EA' },
          { label: 'Total Supply', value: '10M 7EA' },
        ].map((stat, index) => (
          <div key={index} className={`p-4 rounded-xl ${
            isDark ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {stat.label}
            </div>
            <div className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};