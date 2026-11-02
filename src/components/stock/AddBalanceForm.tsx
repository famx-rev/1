import React, { useState } from 'react';
import { Plus, Loader } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AddBalanceFormProps {
  onSuccess: () => void;
}

export const AddBalanceForm = ({ onSuccess }: AddBalanceFormProps) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://api-eight-navy-68.vercel.app/api/balance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          type: 'credit'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update balance');
      }

      setAmount('');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update balance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-4 rounded-xl ${
      isDark ? 'bg-white/5' : 'bg-gray-50'
    }`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Amount (7EA)
          </label>
          <input
            type="number"
            step="0.00000001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-white/5 border-white/10 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            placeholder="Enter amount"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium ${
            isDark
              ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } transition-colors disabled:opacity-50`}
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add Balance
            </>
          )}
        </button>
      </form>
    </div>
  );
};