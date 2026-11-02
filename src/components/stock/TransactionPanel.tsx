import React from 'react';
import { Send, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface TransactionPanelProps {
  onTransactionTypeSelect: (type: 'send' | 'receive') => void;
}

export const TransactionPanel = ({ onTransactionTypeSelect }: TransactionPanelProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl border p-6 ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
    }`}>
      <h2 className={`text-xl font-semibold mb-6 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        Quick Actions
      </h2>
      <div className="space-y-4">
        <button
          onClick={() => onTransactionTypeSelect('send')}
          className={`w-full flex items-center justify-between p-4 rounded-xl ${
            isDark
              ? 'bg-white/5 hover:bg-white/10'
              : 'bg-gray-50 hover:bg-gray-100'
          } transition-all duration-300`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-blue-500/20' : 'bg-blue-50'
            }`}>
              <Send className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            </div>
            <div className="text-left">
              <div className={`font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Send 7EA
              </div>
              <div className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Transfer to another wallet
              </div>
            </div>
          </div>
          <ArrowUpRight className={isDark ? 'text-gray-400' : 'text-gray-600'} />
        </button>

        <button
          onClick={() => onTransactionTypeSelect('receive')}
          className={`w-full flex items-center justify-between p-4 rounded-xl ${
            isDark
              ? 'bg-white/5 hover:bg-white/10'
              : 'bg-gray-50 hover:bg-gray-100'
          } transition-all duration-300`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-green-500/20' : 'bg-green-50'
            }`}>
              <Wallet className={isDark ? 'text-green-400' : 'text-green-600'} />
            </div>
            <div className="text-left">
              <div className={`font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Receive 7EA
              </div>
              <div className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Get your wallet address
              </div>
            </div>
          </div>
          <ArrowDownRight className={isDark ? 'text-gray-400' : 'text-gray-600'} />
        </button>
      </div>
    </div>
  );
};