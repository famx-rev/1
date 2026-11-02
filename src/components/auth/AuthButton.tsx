import React from 'react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const AuthButton = ({ children, isLoading, ...props }: AuthButtonProps) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className="group relative flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? (
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : children}
    </button>
  );
};
