import React from 'react';
import { CreditCard, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const PaymentMethods = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cards = [
    {
      type: 'Visa',
      last4: '4242',
      expiry: '12/24',
      isDefault: true
    },
    {
      type: 'Mastercard',
      last4: '8888',
      expiry: '06/25',
      isDefault: false
    }
  ];

  return (
    <div className={`rounded-2xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
    } p-6`}>
      <h2 className={`text-xl font-semibold mb-6 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        Payment Methods
      </h2>

      <div className="space-y-4">
        {cards.map((card, index) => (
          <div key={index} className={`p-4 rounded-xl ${
            isDark ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className={
                  isDark ? 'text-gray-400' : 'text-gray-600'
                } />
                <div>
                  <p className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {card.type} •••• {card.last4}
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Expires {card.expiry}
                  </p>
                </div>
              </div>
              <button className={`p-2 rounded-lg ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              } transition-all duration-300`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {card.isDefault && (
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  Default
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};