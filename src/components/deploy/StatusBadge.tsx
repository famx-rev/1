import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'running' | 'stopped' | 'error';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'running':
        return {
          icon: CheckCircle,
          bg: 'bg-green-500/10',
          text: 'text-green-500',
          border: 'border-green-500/20'
        };
      case 'stopped':
        return {
          icon: XCircle,
          bg: 'bg-gray-500/10',
          text: 'text-gray-500',
          border: 'border-gray-500/20'
        };
      case 'error':
        return {
          icon: AlertCircle,
          bg: 'bg-red-500/10',
          text: 'text-red-500',
          border: 'border-red-500/20'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`
      inline-flex items-center gap-1.5 px-2 py-1
      rounded-full text-xs font-medium
      ${config.bg} ${config.text} border ${config.border}
    `}>
      <Icon className="w-3 h-3" />
      <span className="capitalize">{status}</span>
    </div>
  );
};