import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isExternal?: boolean;
}

export const NavLink = ({ to, children, isExternal = false }: NavLinkProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const className = `${
    isDark 
      ? 'text-gray-300 hover:text-white dark-glow-xs' 
      : 'text-gray-600 hover:text-gray-900'
  } transition-colors duration-200`;

  if (isExternal) {
    return (
      <a href={to} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};