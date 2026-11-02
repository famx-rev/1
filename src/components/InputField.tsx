import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
}

export const InputField = ({ label, icon, ...props }: InputFieldProps) => {
  return (
    <div className="relative">
      <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          {icon}
        </div>
        <input
          {...props}
          className="w-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
        />
      </div>
    </div>
  );
};