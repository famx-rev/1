import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { useHeaderAnimation } from '../hooks/useHeaderAnimation';
import { NavLink } from './navigation/NavLink';
import { LayoutDashboard } from 'lucide-react';
import { authService } from '../services/auth.service';

export const Header = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const isVisible = useHeaderAnimation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, [location.pathname]);

  const navItems = [
    { name: 'Documentation', path: '/documentation' },
    { name: 'Contact', path: '/contact' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://idealfrank.sirv.com/famx_logo_final.png" 
              alt="Logo" 
              className="h-5 w-auto"
            />
            <span className={`text-xl font-bold ${
              isDark 
                ? 'text-white dark-glow-sm' 
                : 'text-gray-900'
            }`}>
              CloudPlatform
            </span>
          </Link>

          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-6 mr-8">
              {navItems.map((item) => (
                <NavLink key={item.name} to={item.path}>
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-5 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-lg transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              ) : location.pathname !== '/login' && (
                <Link
                  to="/login"
                  className="inline-flex h-10 items-center rounded-full border border-gray-200 bg-white/70 px-5 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-lg transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-gray-100 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  Sign in
                </Link>
              )}
              <div className="relative">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};