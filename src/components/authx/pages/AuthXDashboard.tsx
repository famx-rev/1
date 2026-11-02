import React, { useState } from 'react';
import { 
  Users, Shield, Key, Globe, Clock, AlertTriangle,
  BarChart2, ArrowUp, ArrowDown, Activity
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export const AuthXDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const stats = [
    {
      title: 'Total Users',
      value: '12,345',
      change: '+12.3%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Authentication Rate',
      value: '99.9%',
      change: '+0.5%',
      trend: 'up',
      icon: Key,
      color: 'green'
    },
    {
      title: 'Failed Logins',
      value: '23',
      change: '-5.2%',
      trend: 'down',
      icon: Shield,
      color: 'red'
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: '+8.1%',
      trend: 'up',
      icon: Globe,
      color: 'purple'
    }
  ];

  const recentActivity = [
    {
      type: 'login',
      user: 'john.doe@example.com',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      type: 'signup',
      user: 'jane.smith@example.com',
      time: '5 minutes ago',
      status: 'success'
    },
    {
      type: 'login_failed',
      user: 'unknown@example.com',
      time: '10 minutes ago',
      status: 'failed'
    }
  ];

  return (
    <div className="space-y-6">
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
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
              </div>
              <div>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.title}
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
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication Chart */}
        <div className={`p-6 rounded-xl border ${
          isDark
            ? 'bg-white/5 border-white/10'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Authentication Trends
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Login success rate over time
              </p>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`px-3 py-1.5 rounded-lg border ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center">
            <BarChart2 className={`w-8 h-8 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <span className={`ml-2 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Chart visualization would go here
            </span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-xl border ${
          isDark
            ? 'bg-white/5 border-white/10'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <Activity className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Activity
            </h3>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  isDark ? 'bg-white/5' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activity.status === 'success' ? (
                      <Shield className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {activity.user}
                      </p>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {activity.type.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};