import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  message?: string;
  isDark?: boolean;
}

export const SuccessMessage = ({ 
  message = "Thanks for joining! We'll keep you updated.",
  isDark = false
}: SuccessMessageProps) => {
  return (
    <div className={`
      p-8 rounded-2xl backdrop-blur-xl text-center relative overflow-hidden
      ${isDark ? 'bg-white/5' : 'bg-white/80'}
      border border-white/10
      transition-colors duration-300
    `}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/20 rounded-full filter blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
        <div className={`
          inline-flex items-center justify-center w-20 h-20 rounded-full mb-6
          ${isDark ? 'bg-green-500/20' : 'bg-green-100'}
        `}>
          <CheckCircle className={`w-10 h-10 ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`} />
        </div>

        <h2 className={`text-3xl font-bold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          You're on the list!
        </h2>

        <p className={`text-lg ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {message}
        </p>
      </div>
    </div>
  );
};