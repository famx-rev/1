import React from 'react';
import { Palette, Key, Shield, Code } from 'lucide-react';
import { useTheme } from '../../../../../contexts/ThemeContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ConfigureSidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const tabs = [
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'auth', label: 'Authentication', icon: Shield },
    { id: 'oauth', label: 'OAuth', icon: Key },
    { id: 'api', label: 'API', icon: Code }
  ];

  return (
    <div className="w-64 shrink-0">
      <div className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
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
      </div>
    </div>
  );
};