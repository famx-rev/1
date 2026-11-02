import React from 'react';
import { Users, Share2, Clock, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  period?: string;
}

const StatCard = ({ title, value, icon, period }: StatCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`p-6 rounded-xl border transition-all duration-300 ${
      isDark
        ? 'bg-white/5 border-white/10 hover:bg-white/10'
        : 'bg-white border-gray-200 hover:shadow-lg'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${
          isDark ? 'bg-white/10' : 'bg-blue-50'
        }`}>
          {icon}
        </div>
        <div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {period && (
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {period}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const OverviewSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const stats = [
    { title: 'Total sign ups', value: '1', icon: <Users className="w-5 h-5 text-blue-500" /> },
    { title: 'Referrals', value: '0', icon: <Share2 className="w-5 h-5 text-purple-500" /> }
  ];

  const timeStats = [
    { title: 'Last 24h', value: '0', icon: <Clock className="w-5 h-5 text-green-500" /> },
    { title: 'Last week', value: '0', icon: <Clock className="w-5 h-5 text-yellow-500" /> },
    { title: 'Last month', value: '0', icon: <Clock className="w-5 h-5 text-orange-500" /> }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {timeStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className={`p-6 rounded-xl border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Feed
        </h3>
        
        <div className="text-center py-8">
          <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No activity yet
          </p>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Share your sign-up form to start collecting subscribers.
          </p>
          <button className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}>
            Go to journey
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};