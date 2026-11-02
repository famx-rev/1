import React from 'react';
import { 
  Key, Shield, Users, Database, Settings, 
  Globe, Zap, ArrowRight, Code, Lock,
  Activity, BarChart2, TrendingUp, TrendingDown
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export const UniverseOverview = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const stats = [
    { label: 'Total APIs', value: '48', trend: 'up', change: '+12.3%' },
    { label: 'Active Users', value: '1,234', trend: 'up', change: '+8.1%' },
    { label: 'Total Requests', value: '1.2M', trend: 'up', change: '+15.4%' },
    { label: 'Error Rate', value: '0.1%', trend: 'down', change: '-5.2%' }
  ];

  const apis = [
    {
      name: 'Payment API',
      status: 'active',
      requests: '450K',
      latency: '120ms',
      uptime: '99.9%'
    },
    {
      name: 'User Service',
      status: 'active',
      requests: '380K',
      latency: '85ms',
      uptime: '99.95%'
    },
    {
      name: 'Analytics API',
      status: 'active',
      requests: '290K',
      latency: '95ms',
      uptime: '99.8%'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border transition-all duration-300 ${
              isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                : 'bg-white border-gray-200 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </p>
                <div className="flex items-center gap-2">
                  <h3 className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </h3>
                  <span className={`flex items-center text-sm ${
                    stat.trend === 'up'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API Status */}
      <div className={`p-6 rounded-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            API Status
          </h2>
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}>
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {apis.map((api, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className={`w-5 h-5 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div>
                    <h3 className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {api.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        api.status === 'active'
                          ? isDark
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-green-100 text-green-800'
                          : isDark
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {api.status}
                      </span>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {api.requests} requests
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Latency: {api.latency}
                  </div>
                  <div className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Uptime: {api.uptime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`p-6 rounded-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-6 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart2 className={`w-5 h-5 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      API Request Spike
                    </p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Increased traffic detected on Payment API
                    </p>
                  </div>
                </div>
                <span className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  2 minutes ago
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};