import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MoreVertical, Loader, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { waitlistApi, WaitlistUser } from '../api';

interface PeopleSectionProps {
  projectId: string;
}

export const PeopleSection = ({ projectId }: PeopleSectionProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [projectId]);

  const fetchUsers = async () => {
    try {
      const data = await waitlistApi.getUsers(projectId);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className={`p-2 rounded-lg ${
            isDark
              ? 'hover:bg-white/10 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}>
            <Filter className="w-5 h-5" />
          </button>
          <button className={`p-2 rounded-lg ${
            isDark
              ? 'hover:bg-white/10 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}>
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={`rounded-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${
              isDark ? 'border-white/10' : 'border-gray-200'
            }`}>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Sign Up Date</th>
              <th className="text-left p-4">Referrals</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className={`border-b last:border-b-0 ${
                isDark ? 'border-white/10' : 'border-gray-200'
              }`}>
                <td className={`p-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.email}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'pending'
                      ? isDark
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-yellow-100 text-yellow-800'
                      : isDark
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className={`p-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className={`p-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.referral_count}
                </td>
                <td className="p-4">
                  <button className={`p-1 rounded-lg ${
                    isDark
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}>
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              No users found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};