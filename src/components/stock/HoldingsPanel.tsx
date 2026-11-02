import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const HoldingsPanel = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const holdings = [
    {
      amount: '1,500',
      value: '$15,000',
      purchasePrice: '$8.50',
      profit: '+$2,250',
      profitPercentage: '+17.65%',
      isProfit: true
    }
  ];

  return (
    <div className={`rounded-2xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
    } p-6`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          isDark ? 'bg-purple-500/20' : 'bg-purple-50'
        }`}>
          <Wallet className={isDark ? 'text-purple-400' : 'text-purple-600'} />
        </div>
        <h2 className={`text-xl font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Your Holdings
        </h2>
      </div>

      {holdings.map((holding, index) => (
        <div key={index} className="space-y-4">
          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Amount
                </p>
                <p className={`text-xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {holding.amount} 7EA
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Value
                </p>
                <p className={`text-xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {holding.value}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Avg. Purchase Price
                </p>
                <p className={`font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {holding.purchasePrice}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Profit/Loss
                </p>
                <div className="flex items-center justify-end gap-2">
                  {holding.isProfit ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <p className={`font-medium ${
                    holding.isProfit ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {holding.profit} ({holding.profitPercentage})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};