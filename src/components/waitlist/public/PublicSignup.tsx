import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Loader, Sun, Moon } from 'lucide-react';
import { SignupForm } from './api';

interface PublicSignupProps {
  formData: SignupForm;
  onSubmit: (email: string) => Promise<void>;
}

export const PublicSignup = ({ formData, onSubmit }: PublicSignupProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('publicTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('publicTheme', 'light');
    }
  }, [isDark]);

  // Default values from formData
  const {
    backgroundColor = formData.backgroundColor || '#ffffff',
    backgroundOpacity = formData.backgroundOpacity || 0.26,
    buttonText = formData.buttonText || 'Join Waitlist',
    description = formData.description || 'Sign up to get early access',
    logo = formData.logo,
    title = formData.title || 'Join the Waitlist',
    borderStyle = formData.borderStyle || 'border-white/10',
    blurEffect = formData.blurEffect || 'backdrop-blur-md',
    successMessage = formData.successMessage || 'Thanks for joining! We\'ll keep you updated.'
  } = formData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(email);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Determine if we should apply background and shadow styles
  const shouldApplyBackground = borderStyle !== 'border-transparent';

  // Convert background color and opacity to rgba for light mode only
  const getBackground = () => {
    if (isDark) {
      return 'rgb(0, 0, 0)'; // Dark mode always uses solid black
    }
    // Light mode uses rgba
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${backgroundOpacity})`;
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: getBackground() }}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-3 rounded-full transition-all duration-300 ${
          isDark 
            ? 'bg-white/10 hover:bg-white/20 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        } z-50`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${
          isDark ? 'bg-gradient-to-br from-white/5 to-black/5' : 'bg-gradient-to-br from-gray-50/50 to-white/50'
        }`} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full filter blur-[100px] animate-pulse delay-700" />
      </div>
      
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-12">
        <div className={`${blurEffect} rounded-2xl p-8 transition-colors duration-300 ${
          shouldApplyBackground 
            ? isDark 
              ? 'bg-black/50' 
              : 'bg-white/50 shadow-lg'
            : ''
        } ${borderStyle}`}>
          {logo && (
            <div className="flex justify-center mb-8">
              <img 
                src={logo} 
                alt="Logo" 
                className="h-12 w-auto"
              />
            </div>
          )}

          <div className="text-center mb-8">
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h1>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`
                  w-full pl-12 pr-4 py-3 rounded-xl text-lg
                  transition-all duration-300
                  ${isDark
                    ? 'bg-white/10 text-white placeholder-gray-400'
                    : 'bg-white text-gray-900 placeholder-gray-500 shadow-lg'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50
                `}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                mt-4 w-full flex items-center justify-center gap-2 px-6 py-3
                rounded-xl font-medium text-lg transition-all duration-300
                ${isDark
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
                disabled:opacity-50
              `}
            >
              {isSubmitting ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {buttonText}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Powered by 7EA */}
          <div className="mt-8 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isDark 
                ? 'bg-white/5 backdrop-blur-sm border border-white/10' 
                : 'bg-gray-50 shadow-sm'
            }`}>
              <img 
                src="https://raw.githubusercontent.com/7054company/7eax/refs/heads/master/logo1.png" 
                alt="7EA Logo" 
                className="h-5 w-auto"
              />
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Powered by 7EA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};