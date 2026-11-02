import React from 'react';
import { CreditCard } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const BillingHeader = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          isDark ? 'text-white dark-glow-sm' : 'text-gray-900'
        }`}>
          Billing & Payments
        </h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Manage your subscription and payment methods
        </p>
      </div>
      <button 
        className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
          isDark
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } transition-all duration-300`}
      >
        <CreditCard className="w-4 h-4" />
        Add Payment Method
      </button>
    </div>
  );
};