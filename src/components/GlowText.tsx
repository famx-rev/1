import React from 'react';

interface GlowTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GlowText = ({ children, className = '' }: GlowTextProps) => {
  return (
    <span className={`animate-glow relative inline-block ${className}`}>
      {children}
    </span>
  );
};