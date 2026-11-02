import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface NeonCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  glowColor: string;
  lightGlowColor: string;
}

export const NeonCard = ({ 
  title, 
  description, 
  icon, 
  glowColor, 
  lightGlowColor 
}: NeonCardProps) => {
  const { theme } = useTheme();
  const currentGlowColor = theme === 'dark' ? glowColor : lightGlowColor;

  return (
    <div className="group relative transform transition-all duration-300 hover:scale-105">
      {/* Glow effect */}
      <div
        className={`absolute -inset-0.5 ${currentGlowColor} opacity-0 group-hover:opacity-75 rounded-xl blur transition duration-500 group-hover:duration-200`}
      />
      
      <div className="relative flex flex-col items-center p-6 rounded-xl backdrop-blur-sm border border-white/10 dark:bg-black/50 bg-white/50">
        <div className="p-3 rounded-lg mb-4 dark:bg-white/5 bg-black/5 group-hover:scale-110 transform transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">{title}</h3>
        <p className="dark:text-gray-400 text-gray-600 text-center">{description}</p>
      </div>
    </div>
  );
};