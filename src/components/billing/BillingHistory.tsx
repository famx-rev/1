import React from 'react';
import { Receipt, Download } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const BillingHistory = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const invoices = [
    {
      id: 'INV-001',
      date: 'Mar 1, 2024',
      amount: '$49.00',
      status: 'Paid'
    },
    {
      id: 'INV-002',
      date: 'Feb 1, 2024',
      amount: '$49.00',
      status: 'Paid'
    },
    {
      id: 'INV-003',
      date: 'Jan 1, 2024',
      amount: '$49.00',
      status: 'Paid'
    }
  ];

  return (
    <div className={`rounded-2xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
    } p-6`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          isDark ? 'bg-purple-500/20' : 'bg-purple-50'
        }`}>
          <Receipt className={isDark ? 'text-purple-400' : 'text-purple-600'} />
        </div>
        <h2 className={`text-xl font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Billing History
        </h2>
      </div>

      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className={`flex items-center justify-between p-4 rounded-xl ${
            isDark ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div>
              <p className={`font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {invoice.id}
              </p>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {invoice.date}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {invoice.amount}
              </span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
              }`}>
                {invoice.status}
              </span>
              <button className={`p-2 rounded-lg ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              } transition-all duration-300`}>
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};