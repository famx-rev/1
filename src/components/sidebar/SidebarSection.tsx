import React from 'react';
import { useSidebar } from './SidebarContext';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SidebarSection = ({ title, children }: SidebarSectionProps) => {
  const { isExpanded } = useSidebar();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="py-2">
      {isExpanded && title && (
        <p className={`
          px-4 mb-2 text-[11px] font-medium uppercase tracking-wider
          ${isDark ? 'text-gray-500' : 'text-gray-400'}
        `}>
          {title}
        </p>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
};
