import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Branding } from './configure/Branding';
import { OAuth } from './configure/OAuth';
import { Auth } from './configure/Auth';
import { ApiConf } from './configure/ApiConf';
import { Legal } from './configure/Legal'; // Add this import
import { useTheme } from '../../../../contexts/ThemeContext';
import { Palette, Key, Shield, Terminal, FileText } from 'lucide-react'; // Add FileText

interface ConfigData {
  branding?: {
    appName?: string;
    logoUrl?: string;
    primaryColor?: string;
    description?: string;
  };
  auth?: {
    emailAuthEnabled?: boolean;
    phoneAuthEnabled?: boolean;
    usernameEnabled?: boolean;
    mfaEnabled?: boolean;
    sessionDuration?: string;
  };
  oauth?: {
    redirectUris?: string[];
    allowedScopes?: string[];
  };
  legal?: {
    termsUrl?: string;
    privacyUrl?: string;
    companyName?: string;
    companyAddress?: string;
    dataProcessingEnabled?: boolean;
    cookieConsentEnabled?: boolean;
  };
}

export const Configure = () => {
  const { appId } = useParams<{ appId: string }>();
  const [activeTab, setActiveTab] = useState('branding');
  const [configData, setConfigData] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (appId) {
      // First try to get from local storage
      const cachedConfig = localStorage.getItem(`authx_apps_conf_${appId}`);
      if (cachedConfig) {
        setConfigData(JSON.parse(cachedConfig));
        setLoading(false);
      }
      
      // Then fetch fresh data
      fetchConfig();
    }
  }, [appId]);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/authx/configure/${appId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch configuration');

      const data = await response.json();
      setConfigData(data.config);
      
      // Cache the config
      localStorage.setItem(`authx_apps_conf_${appId}`, JSON.stringify(data.config));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (section: string, updates: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/authx/configure/${appId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [section]: updates
        })
      });

      if (!response.ok) throw new Error('Failed to update configuration');

      const data = await response.json();
      setConfigData(data.config);
      
      // Update cache
      localStorage.setItem(`authx_apps_conf_${appId}`, JSON.stringify(data.config));
      
      return true;
    } catch (err) {
      throw err;
    }
  };

  const tabs = [
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'auth', label: 'Authentication', icon: Shield },
    { id: 'oauth', label: 'OAuth', icon: Key },
    { id: 'legal', label: 'Legal', icon: FileText }, // Add this tab
    { id: 'api', label: 'API', icon: Terminal }
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'branding':
        return (
          <Branding 
            config={configData?.branding} 
            onUpdate={(updates) => handleUpdateConfig('branding', updates)} 
          />
        );
      case 'auth':
        return (
          <Auth 
            config={configData?.auth} 
            onUpdate={(updates) => handleUpdateConfig('auth', updates)} 
          />
        );
      case 'oauth':
        return (
          <OAuth 
            config={configData?.oauth} 
            onUpdate={(updates) => handleUpdateConfig('oauth', updates)} 
          />
        );
      case 'legal':
        return (
          <Legal
            config={configData?.legal}
            onUpdate={(updates) => handleUpdateConfig('legal', updates)}
          />
        );
      case 'api':
        return <ApiConf appId={appId!} />;
      default:
        return (
          <Branding 
            config={configData?.branding} 
            onUpdate={(updates) => handleUpdateConfig('branding', updates)} 
          />
        );
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className={`w-64 shrink-0 rounded-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}>
        <div className="p-4">
          <h3 className={`text-lg font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Configuration
          </h3>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                  transition-all duration-300
                  ${activeTab === tab.id
                    ? isDark
                      ? 'bg-white/10 text-white'
                      : 'bg-blue-50 text-blue-600'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};
