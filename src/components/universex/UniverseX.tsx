import React, { useState } from 'react';
import { UniverseNav } from './pages/UniverseNav';
import { UniverseDashboard } from './pages/UniverseDashboard';
import { UniverseOverview } from './pages/UniverseOverview';
import { UniverseWelcome } from './pages/UniverseWelcome';
import { UniverseMarketplace } from './pages/Marketplace/UniverseMarketplace';
import { useTheme } from '../../contexts/ThemeContext';

export const UniverseX = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return <UniverseWelcome />;
      case 'overview':
        return <UniverseOverview />;
      case 'marketplace':
        return <UniverseMarketplace />;
      case 'dashboard':
        return <UniverseDashboard />;
      default:
        return <UniverseWelcome />;
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
            UniverseX Dashboard
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Explore the digital universe and discover new possibilities
          </p>
        </div>

        {/* Navigation */}
        <UniverseNav
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
}