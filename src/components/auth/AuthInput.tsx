import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  labelAction?: React.ReactNode;
}

export const AuthInput = ({ label, icon, labelAction, type, ...props }: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`text-xs font-semibold uppercase tracking-wider ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {icon}
        </div>
        <input
          {...props}
          type={inputType}
          className={`
            w-full h-11 rounded-xl pl-10 pr-10 text-sm
            border transition-all duration-200
            ${isDark
              ? 'bg-black/40 border-white/10 text-white placeholder-gray-500 focus:border-emerald-500'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
            }
            focus:outline-none focus:ring-2 focus:ring-emerald-500/20
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
              isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
