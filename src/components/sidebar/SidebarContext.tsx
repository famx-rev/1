import React, { createContext, useContext, useState, useEffect } from 'react';

type SidebarMode = 'auto' | 'collapsed' | 'expanded';

interface SidebarContextType {
  isExpanded: boolean;
  mode: SidebarMode;
  setMode: (mode: SidebarMode) => void;
  cycleMode: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: (context: SidebarContextType) => React.ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [mode, setModeState] = useState<SidebarMode>(() => {
    const saved = localStorage.getItem('sidebarMode');
    return (saved as SidebarMode) || 'expanded';
  });

  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarMode');
    return saved === 'expanded' || saved === 'auto' || !saved;
  });

  useEffect(() => {
    localStorage.setItem('sidebarMode', mode);
    if (mode === 'expanded') {
      setIsExpanded(true);
    } else if (mode === 'collapsed') {
      setIsExpanded(false);
    } else {
      setIsExpanded(false);
    }
  }, [mode]);

  const setMode = (newMode: SidebarMode) => {
    setModeState(newMode);
  };

  const cycleMode = () => {
    setModeState(current => {
      if (current === 'collapsed') return 'auto';
      if (current === 'auto') return 'expanded';
      return 'collapsed';
    });
  };

  const handleMouseEnter = () => {
    if (mode === 'auto') setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (mode === 'auto') setIsExpanded(false);
  };

  return (
    <SidebarContext.Provider value={{ isExpanded, mode, setMode, cycleMode, handleMouseEnter, handleMouseLeave }}>
      {children({ isExpanded, mode, setMode, cycleMode, handleMouseEnter, handleMouseLeave })}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
