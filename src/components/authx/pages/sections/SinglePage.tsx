import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, ExternalLink, Loader, AlertCircle
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { Nav } from './Nav';
import { Docs } from './docs';
import { Configure } from './Configure';
import { Overview } from './Overview';
import { Users } from './Users';
import { authxApi, App } from '../api';

export const SinglePage = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeSection, setActiveSection] = useState('overview');
  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (appId) {
      fetchAppDetails();
    }
  }, [appId]);

  const fetchAppDetails = async () => {
    try {
      // First try to get from cache
      const cachedApps = authxApi.getCachedApps();
      const cachedApp = cachedApps?.find(a => a.id === appId);
      if (cachedApp) {
        setApp(cachedApp);
        setLoading(false);
      }

      // Then fetch fresh data
      const data = await authxApi.getApp(appId!);
      setApp(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleBack = () => {
    navigate('/authority/apps');
  };

  const renderContent = () => {
    if (!app) return null;

    switch (activeSection) {
      case 'docs':
        return <Docs />;
      case 'configure':
        return <Configure />;
      case 'overview':
        return <Overview />;
      case 'users':
        return <Users appId={appId!} />;
      default:
        return <Overview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-600 dark:text-red-400">
              {error || 'Application not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className={`p-2 rounded-lg ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {app.name}
              </h2>
              {app.domain && (
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {app.domain}
                </p>
              )}
            </div>
          </div>
          {app.domain && (
            <a
              href={`https://${app.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              View Live
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Navigation */}
        <Nav activeTab={activeSection} onTabChange={handleSectionChange} />

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};