import React from 'react';
import { Users, Map, Megaphone, Link, Settings, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface WaitlistNavProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
}

export const WaitlistNav = ({ activeSection, onSectionChange }: WaitlistNavProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'people', label: 'People', icon: Users },
    { id: 'journey', label: 'Journey', icon: Map },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className={`flex items-center gap-1 p-1 mb-8 rounded-xl ${
      isDark ? 'bg-white/5' : 'bg-gray-100'
    }`}>
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSectionChange(id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            activeSection === id
              ? isDark
                ? 'bg-white/10 text-white'
                : 'bg-white text-gray-900 shadow-sm'
              : isDark
                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </nav>
  );
};