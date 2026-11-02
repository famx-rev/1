import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Loader, AlertCircle, LayoutGrid as Layout, Globe, Server, Command } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { authxApi, App } from './api';
import { CreateApp } from './Create';

export const AuthXApplications = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const cachedApps = localStorage.getItem('authx_apps');
    if (cachedApps) {
      setApps(JSON.parse(cachedApps));
      setLoading(false);
    } else {
      fetchApps();
    }
  }, []);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const data = await authxApi.getApps();
      setApps(data);
      localStorage.setItem('authx_apps', JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleAppClick = (appId: string) => {
    navigate(`/authority/apps/${appId}`);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchApps();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <div className="absolute inset-0 blur-lg bg-blue-500/20 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Gradient Background */}
      <div className={`
        relative p-6 rounded-2xl overflow-hidden
        ${isDark
          ? 'bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10'
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
        }
      `}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        </div>

        <div className="relative flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-12 pr-4 py-3 rounded-xl border text-lg
                  backdrop-blur-lg transition-all duration-300
                  ${isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                    : 'bg-white/70 border-gray-200 text-gray-900 placeholder-gray-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50
                `}
              />
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium
              transition-all duration-300 transform hover:scale-105
              ${isDark
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }
              shadow-lg hover:shadow-xl backdrop-blur-lg
            `}
          >
            <Plus className="w-5 h-5" />
            New Application
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps
          .filter((app) =>
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.type.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className={`
                group relative p-6 rounded-xl border text-left
                transition-all duration-300 transform hover:scale-[1.02]
                ${isDark
                  ? 'bg-gradient-to-br from-white/5 to-white/0 border-white/10 hover:bg-white/10'
                  : 'bg-white border-gray-200 hover:shadow-xl'
                }
              `}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className={`
                  inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4
                  ${isDark ? 'bg-white/10' : 'bg-blue-50'}
                `}>
                  {app.type === 'web' && <Globe className={isDark ? 'text-blue-400' : 'text-blue-600'} />}
                  {app.type === 'api' && <Server className={isDark ? 'text-purple-400' : 'text-purple-600'} />}
                  {app.type === 'cli' && <Command className={isDark ? 'text-green-400' : 'text-green-600'} />}
                </div>

                <h3 className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {app.name}
                </h3>

                <div className="flex items-center gap-4">
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${isDark
                      ? 'bg-white/10 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                    }
                  `}>
                    {app.type}
                  </span>
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Updated {app.lastUpdated}
                  </span>
                </div>
              </div>
            </button>
          ))}
      </div>

      {/* Create App Modal */}
      {showCreateModal && (
        <CreateApp 
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};