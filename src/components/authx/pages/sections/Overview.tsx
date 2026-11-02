import React from 'react';
import { Users, Building2, Clock, Code, 
  ExternalLink, Copy, Check, Terminal, Globe,
  Shield, Zap, Settings, ChevronRight
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

export const Overview = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copiedCommand, setCopiedCommand] = React.useState(false);

  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'blue' },
    { label: 'Active Now', value: '256', icon: Clock, color: 'green' },
    { label: 'API Calls', value: '2.3M', icon: Terminal, color: 'purple' }
  ];

  const features = [
    {
      title: 'Authentication',
      description: 'Secure user authentication with multiple providers',
      icon: Shield,
      color: 'blue'
    },
    {
      title: 'API Access',
      description: 'Full access to RESTful APIs',
      icon: Code,
      color: 'purple'
    },
    {
      title: 'Performance',
      description: 'Optimized for high performance',
      icon: Zap,
      color: 'yellow'
    }
  ];

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
              </div>
              <div>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border transition-all duration-300 ${
              isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                : 'bg-white border-gray-200 hover:shadow-lg'
            }`}
          >
            <div className={`p-3 rounded-lg bg-${feature.color}-500/10 inline-block mb-4`}>
              <feature.icon className={`w-5 h-5 text-${feature.color}-500`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {feature.title}
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Setup */}
      <div className={`p-6 rounded-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Quick Setup
          </h3>
          <button
            onClick={() => handleCopy('npm install @authx/sdk')}
            className={`p-2 rounded-lg ${
              isDark
                ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            {copiedCommand ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className={`p-4 rounded-lg font-mono text-sm ${
          isDark ? 'bg-black/30' : 'bg-gray-900'
        }`}>
          <code className="text-white">npm install @authx/sdk</code>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`p-6 rounded-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Recent Activity
        </h3>
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
                  <Users className={`w-5 h-5 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      New user signed up
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