import React from 'react';
import { 
  Rocket, Globe, ShoppingBag, LayoutDashboard,
  Zap, Menu
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface UniverseNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const UniverseNav = ({ activeSection, onSectionChange }: UniverseNavProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'getting-started', label: 'Getting Started', icon: Rocket },
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'power', label: 'Power Center', icon: Zap }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`md:hidden p-2 rounded-lg ${
          isDark
            ? 'bg-white/10 text-white'
            : 'bg-gray-100 text-gray-900'
        } mb-4`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu */}
      <div className={`
        md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
        transition-opacity duration-300
        ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <div className={`
          w-64 h-full bg-white dark:bg-gray-900 transform transition-transform duration-300
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4 space-y-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  onSectionChange(id);
                  setIsMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 rounded-lg
                  transition-all duration-300
                  ${activeSection === id
                    ? isDark
                      ? 'bg-white/10 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className={`hidden md:flex items-center gap-1 p-1 mb-8 rounded-xl overflow-x-auto ${
        isDark ? 'bg-white/5' : 'bg-gray-100'
      }`}>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap
              transition-all duration-300
              ${activeSection === id
                ? isDark
                  ? 'bg-white/10 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
                : isDark
                  ? 'text-gray-400 hover:text-white hover:bg-white/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}