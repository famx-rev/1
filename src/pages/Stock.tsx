import React, { useState, useEffect } from 'react';
import { CoinHeader } from '../components/stock/CoinHeader';
import { CoinStats } from '../components/stock/CoinStats';
import { TransactionPanel } from '../components/stock/TransactionPanel';
import { AddBalanceForm } from '../components/stock/AddBalanceForm';

interface BalanceData {
  balance: string;
  value: string;
  purchasePrice: string;
  profit: string;
  profitPercentage: string;
}

export const Stock = () => {
  const [balanceData, setBalanceData] = useState<BalanceData>({
    balance: "0",
    value: "0",
    purchasePrice: "0",
    profit: "0",
    profitPercentage: "0"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [transactionType, setTransactionType] = useState<'send' | 'receive' | null>(null);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://api-eight-navy-68.vercel.app/api/balance', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch balance data');
      }

      const data = await response.json();
      setBalanceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load balance data');
      console.error('Error fetching balance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <CoinHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CoinStats 
              balance={balanceData.balance}
              value={balanceData.value}
              purchasePrice={balanceData.purchasePrice}
              profit={balanceData.profit}
              profitPercentage={balanceData.profitPercentage}
              loading={loading}
              error={error}
            />
          </div>
          
          <div className="space-y-6">
            <TransactionPanel 
              onTransactionTypeSelect={setTransactionType} 
            />
            <AddBalanceForm onSuccess={fetchBalance} />
          </div>
        </div>
      </div>
    </div>
  );
};