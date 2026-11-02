import React from 'react';
import { 
  Key, Shield, Users, Database, Settings, 
  Globe, Zap, ArrowRight, Code, Lock
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export const AuthXOverview = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const stats = [
    { label: 'Total Users', value: '12,345' },
    { label: 'Active Applications', value: '48' },
    { label: 'Auth Success Rate', value: '99.9%' },
    { label: 'Total API Calls', value: '1.2M' }
  ];

  const quickActions = [
    { 
      title: 'Create Application',
      icon: Code,
      description: 'Set up a new application with AuthX',
      color: 'blue'
    },
    {
      title: 'Configure SSO',
      icon: Key,
      description: 'Set up Single Sign-On for your organization',
      color: 'purple'
    },
    {
      title: 'Security Settings',
      icon: Shield,
      description: 'Review and update security configurations',
      color: 'red'
    },
    {
      title: 'User Management',
      icon: Users,
      description: 'Manage users, roles, and permissions',
      color: 'green'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border transition-all duration-300 ${
              isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                : 'bg-white border-gray-200 hover:shadow-lg'
            }`}
          >
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {stat.label}
            </p>
            <p className={`text-2xl font-bold mt-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={`p-6 rounded-2xl border ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-white/10'
          : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
      }`}>
        <h2 className={`text-xl font-bold mb-6 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`group p-6 rounded-xl text-left transition-all duration-300 ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                  : 'bg-white hover:shadow-lg border border-gray-200'
              }`}
            >
              <div className={`p-3 rounded-lg bg-${action.color}-500/10 mb-4`}>
                <action.icon className={`w-6 h-6 text-${action.color}-500`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {action.title}
              </h3>
              <p className={`text-sm mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {action.description}
              </p>
              <div className={`flex items-center text-sm font-medium ${
                isDark ? `text-${action.color}-400` : `text-${action.color}-600`
              }`}>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`p-6 rounded-2xl border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-xl font-bold mb-6 ${
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
                  <Lock className={`w-5 h-5 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Successful Authentication
                    </p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      user@example.com
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