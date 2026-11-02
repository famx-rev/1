import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const RetroGrid = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-full h-full">
        {/* Grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px), 
                           linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)`,
          backgroundSize: '2rem 2rem',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px)',
          opacity: 0.5,
        }} />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white dark:to-black" />
      </div>
    </div>
  );
};