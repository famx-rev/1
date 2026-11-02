import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`w-full max-w-md rounded-2xl border p-8 sm:p-10 shadow-sm transition-colors duration-300 ${
      isDark
        ? 'bg-white/[0.03] border-white/10'
        : 'bg-gray-50 border-gray-200'
    }`}>
      {children}
    </div>
  );
};
