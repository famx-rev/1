import React, { useState } from 'react';
import { AuthXNav } from './pages/AuthXNav';
import { AuthXDashboard } from './pages/AuthXDashboard';
import { AuthXOverview } from './pages/AuthXOverview';
import { AuthXWelcome } from './pages/AuthXWelcome';
import { AuthXApplications } from './pages/AuthXApplications';
import { useTheme } from '../../contexts/ThemeContext';

export const AuthX = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return <AuthXWelcome />;
      case 'overview':
        return <AuthXOverview />;
      case 'applications':
         return <AuthXApplications />;
      case 'users':
      case 'authentication':
      case 'security':
      case 'databases':
      case 'monitoring':
      case 'settings':
        return <AuthXDashboard />;
      default:
        return <AuthXWelcome />;
    }
  };

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-black' : 'bg-white'
    } pt-24 pb-12 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            AuthX Dashboard
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Manage your authentication and security settings
          </p>
        </div>

        {/* Navigation */}
        <AuthXNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div className="relative">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};