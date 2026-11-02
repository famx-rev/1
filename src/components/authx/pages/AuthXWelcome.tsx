import React from 'react';
import { 
  Rocket, ArrowRight, Code, Key, Shield, 
  Users, Database, Zap, Lock, Globe
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export const AuthXWelcome = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const quickStarts = [
    {
      title: 'Native Application',
      icon: Code,
      description: 'Mobile or desktop apps that run natively on devices',
      color: 'blue'
    },
    {
      title: 'Single Page App',
      icon: Globe,
      description: 'JavaScript apps that run in the browser',
      color: 'purple'
    },
    {
      title: 'Backend API',
      icon: Database,
      description: 'Secure your APIs and services',
      color: 'green'
    }
  ];

  const features = [
    {
      title: 'Authentication',
      icon: Key,
      description: 'Implement secure login flows with multiple providers',
      color: 'indigo'
    },
    {
      title: 'User Management',
      icon: Users,
      description: 'Manage users, roles, and permissions',
      color: 'blue'
    },
    {
      title: 'Security',
      icon: Shield,
      description: 'Advanced security features and compliance',
      color: 'red'
    },
    {
      title: 'Performance',
      icon: Zap,
      description: 'High-performance authentication infrastructure',
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className={`relative p-8 rounded-2xl overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-white/10'
          : 'bg-gradient-to-br from-blue-50 to-purple-50'
      }`}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-white/10' : 'bg-white'
            }`}>
              <Rocket className={`w-6 h-6 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Welcome to AuthX
            </h2>
          </div>

          <p className={`text-lg mb-8 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Get started with secure authentication for your applications.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStarts.map((item, index) => (
              <button
                key={index}
                className={`group p-6 rounded-xl text-left transition-all duration-300 ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                    : 'bg-white hover:shadow-lg border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-2 rounded-lg bg-${item.color}-500/10`}>
                    <item.icon className={`w-5 h-5 text-${item.color}-500`} />
                  </div>
                  <h3 className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h3>
                </div>
                <p className={`text-sm mb-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
                <div className={`flex items-center text-sm font-medium ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        <h3 className={`text-xl font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Core Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border transition-all duration-300 ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white border-gray-200 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-${feature.color}-500/10`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-500`} />
                </div>
                <div>
                  <h4 className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};