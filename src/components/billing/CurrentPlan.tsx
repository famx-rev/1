import React from 'react';
import { Zap, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const CurrentPlan = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const features = [
    'Unlimited projects',
    'Priority support',
    'Custom domain',
    'Analytics dashboard',
    'API access'
  ];

  return (
    <div className={`rounded-2xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
    } p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isDark ? 'bg-blue-500/20' : 'bg-blue-50'
          }`}>
            <Zap className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Pro Plan
            </h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              $49/month
            </p>
          </div>
        </div>
        <button className={`px-4 py-2 rounded-xl ${
          isDark
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        } transition-all duration-300`}>
          Change Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className={`w-5 h-5 ${
              isDark ? 'text-green-400' : 'text-green-600'
            }`} />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};