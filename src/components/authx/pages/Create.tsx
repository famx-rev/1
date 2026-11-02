import React, { useState } from 'react';
import { 
  Globe, Server, Command, ArrowRight, X, 
  Loader, AlertCircle, Terminal, Cloud
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { authxApi } from './api';

interface CreateAppProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface AppType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

export const CreateApp = ({ onClose, onSuccess }: CreateAppProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [appName, setAppName] = useState('');
  const [domain, setDomain] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const appTypes: AppType[] = [
    {
      id: 'web',
      name: 'Web Application',
      description: 'Create a secure authentication system for your web application',
      icon: Globe,
      color: 'blue'
    },
    {
      id: 'api',
      name: 'API Service',
      description: 'Protect your API endpoints with robust authentication',
      icon: Server,
      color: 'purple'
    },
    {
      id: 'cli',
      name: 'CLI Tool',
      description: 'Add authentication to your command-line applications',
      icon: Terminal,
      color: 'green'
    }
  ];

  const handleCreate = async () => {
    if (!selectedType || !appName.trim()) return;

    setIsCreating(true);
    setError('');

    try {
      await authxApi.createApp({
        name: appName.trim(),
        type: selectedType,
        domain: domain.trim() || undefined
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create application');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`
        w-full max-w-2xl rounded-2xl overflow-hidden
        transition-all duration-300 transform
        ${isDark
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10'
          : 'bg-white'
        }
      `}>
        {/* Header */}
        <div className={`
          relative p-6 border-b
          ${isDark ? 'border-white/10' : 'border-gray-200'}
        `}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-white/10' : 'bg-blue-50'
              }`}>
                <Cloud className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <h2 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Create New Application
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {step === 'type' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {appTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    setStep('details');
                  }}
                  className={`
                    group p-6 rounded-xl border text-left
                    transition-all duration-300 transform hover:scale-[1.02]
                    ${isDark
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-white border-gray-200 hover:shadow-lg'
                    }
                  `}
                >
                  <div className={`
                    p-3 rounded-xl mb-4
                    ${isDark ? `bg-${type.color}-500/20` : `bg-${type.color}-50`}
                  `}>
                    <type.icon className={`w-6 h-6 text-${type.color}-500`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {type.name}
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Application Name
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className={`
                    w-full px-4 py-3 rounded-xl border text-lg
                    transition-all duration-300
                    ${isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                  placeholder="My Awesome App"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Domain (Optional)
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className={`
                    w-full px-4 py-3 rounded-xl border text-lg
                    transition-all duration-300
                    ${isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                  placeholder="myapp.com"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`
          p-6 border-t
          ${isDark ? 'border-white/10' : 'border-gray-200'}
        `}>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              Cancel
            </button>
            {step === 'type' ? (
              <button
                onClick={() => setStep('details')}
                disabled={!selectedType}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-lg font-medium
                  transition-all duration-300
                  ${isDark
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }
                  disabled:opacity-50
                `}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={isCreating || !appName.trim()}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-lg font-medium
                  transition-all duration-300
                  ${isDark
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }
                  disabled:opacity-50
                `}
              >
                {isCreating ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Application
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};