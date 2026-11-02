import React, { useState } from 'react';
import { 
  Plus, Code, Copy, Check, Terminal, 
  Activity, Clock, Shield, Database,
  BarChart2, ArrowRight, Settings
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface API {
  id: string;
  name: string;
  endpoint: string;
  method: string;
  status: 'active' | 'inactive';
  type: 'public' | 'private';
  requests: number;
  latency: string;
}

export const UniverseDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copiedApi, setCopiedApi] = useState<string | null>(null);

  const apis: API[] = [
    {
      id: '1',
      name: 'User Authentication',
      endpoint: '/api/v1/auth',
      method: 'POST',
      status: 'active',
      type: 'public',
      requests: 15234,
      latency: '120ms'
    },
    {
      id: '2',
      name: 'Data Analytics',
      endpoint: '/api/v1/analytics',
      method: 'GET',
      status: 'active',
      type: 'private',
      requests: 8765,
      latency: '85ms'
    },
    {
      id: '3',
      name: 'Payment Processing',
      endpoint: '/api/v1/payments',
      method: 'POST',
      status: 'active',
      type: 'private',
      requests: 4321,
      latency: '150ms'
    }
  ];

  const handleCopy = async (text: string, apiId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedApi(apiId);
      setTimeout(() => setCopiedApi(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Your APIs
          </h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Manage and monitor your API endpoints
          </p>
        </div>
        <button className={`
          flex items-center gap-2 px-6 py-3 rounded-xl font-medium
          transition-all duration-300
          ${isDark
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
        `}>
          <Plus className="w-5 h-5" />
          Create API
        </button>
      </div>

      {/* API List */}
      <div className="space-y-6">
        {apis.map((api) => (
          <div
            key={api.id}
            className={`p-6 rounded-xl border transition-all duration-300 ${
              isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                : 'bg-white border-gray-200 hover:shadow-lg'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-white/10' : 'bg-blue-50'
                }`}>
                  <Code className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {api.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
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
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      api.type === 'public'
                        ? isDark
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-blue-100 text-blue-800'
                        : isDark
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-purple-100 text-purple-800'
                    }`}>
                      {api.type}
                    </span>
                  </div>
                </div>
              </div>
              <button className={`p-2 rounded-lg ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}>
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className={`p-4 rounded-lg font-mono text-sm mb-4 ${
              isDark ? 'bg-black/30' : 'bg-gray-900'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-md text-xs ${
                    isDark ? 'bg-white/10' : 'bg-white/20'
                  } text-white`}>
                    {api.method}
                  </span>
                  <code className="text-white">
                    {api.endpoint}
                  </code>
                </div>
                <button
                  onClick={() => handleCopy(api.endpoint, api.id)}
                  className="p-1 rounded hover:bg-white/10"
                >
                  {copiedApi === api.id ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className={`w-4 h-4 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Requests
                  </span>
                </div>
                <p className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {api.requests.toLocaleString()}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className={`w-4 h-4 ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Latency
                  </span>
                </div>
                <p className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {api.latency}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className={`w-4 h-4 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`} />
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Success Rate
                  </span>
                </div>
                <p className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  99.9%
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                transition-all duration-300
                ${isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }
              `}>
                View Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};