import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
type ThemePreference = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
}

const SidebarContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as ThemePreference;
      return saved || 'dark';
    }
    return 'dark';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    if (preference === 'system') return getSystemTheme();
    return preference;
  });

  useEffect(() => {
    const applyTheme = () => {
      const effective = preference === 'system' ? getSystemTheme() : preference;
      setThemeState(effective);
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(effective);
      localStorage.setItem('theme', preference);
    };

    applyTheme();

    if (preference === 'system' && typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [preference]);

  const setTheme = (newPref: ThemePreference) => setPreference(newPref);
  const toggleTheme = () => setPreference(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <SidebarContext.Provider value={{ theme, preference, setTheme, toggleTheme }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
