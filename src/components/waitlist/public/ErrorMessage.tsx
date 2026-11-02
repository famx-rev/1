import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-500" />
      <p className="text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
};