import React from 'react';
import { NavLink } from 'react-router-dom';
import { Divide as LucideIcon } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  badge?: string | number;
}

export const SidebarItem = ({ icon: Icon, label, to, badge }: SidebarItemProps) => {
  const { isExpanded } = useSidebar();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        group relative flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl
        transition-all duration-200 cubic-bezier(0.4, 0, 0.2, 1)
        ${isActive
          ? isDark
            ? 'bg-white/10 text-white shadow-sm'
            : 'bg-gray-200 text-gray-900'
          : isDark
            ? 'text-gray-400 hover:text-white hover:bg-white/5'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
        }
      `}
    >
      <Icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />

      <span className={`
        whitespace-nowrap text-[13px] font-medium
        transition-all duration-200 origin-left
        ${isExpanded
          ? 'opacity-100 scale-100 w-auto'
          : 'opacity-0 scale-0 w-0 overflow-hidden absolute'
        }
      `}>
        {label}
      </span>

      {badge && isExpanded && (
        <span className={`
          ml-auto px-2 py-0.5 text-[10px] font-semibold rounded-full
          transition-all duration-200
          ${isDark
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-emerald-100 text-emerald-600'
          }
        `}>
          {badge}
        </span>
      )}

      {!isExpanded && (
        <div className={`
          absolute left-full ml-3 px-3 py-1.5 rounded-lg
          whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-150 pointer-events-none z-[100]
          text-xs font-medium
          shadow-xl
          ${isDark
            ? 'bg-gray-800 text-white'
            : 'bg-gray-800 text-white'
          }
        `}>
          {label}
        </div>
      )}
    </NavLink>
  );
};
