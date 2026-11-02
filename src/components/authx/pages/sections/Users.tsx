import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, MoreVertical, Loader, AlertCircle, 
  Mail, Calendar, CheckCircle, XCircle, Clock, Globe, Monitor,
  Trash2, List
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

interface UserLog {
  timestamp: string;
  ip: string;
  type: string;
  browser: string;
  os: string;
  device: string;
}

interface User {
  id: string;
  app_id: string;
  email: string;
  username: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  logs: {
    ips: string[];
    activities: UserLog[];
  };
}

interface UsersProps {
  appId: string;
}

export const Users = ({ appId }: UsersProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchUsers();
  }, [appId]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/authx/${appId}/user/all-users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/authx/${appId}/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete user');

      setUsers(users.filter(user => user.id !== userId));
      setMenuOpen(null);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLastLogin = (user: User) => {
    return user.logs?.activities?.find(activity => activity.type === 'login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search users..."
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

      {/* Users Table */}
      <div className={`rounded-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}>
        <table className="w-full">
          <thead>
            <tr className={`border-b ${
              isDark ? 'border-white/10' : 'border-gray-200'
            }`}>
              <th className="text-left p-4">User</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Last Login</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const lastLogin = getLastLogin(user);
              
              return (
                <React.Fragment key={user.id}>
                  <tr className={`border-b last:border-b-0 ${
                    isDark ? 'border-white/10' : 'border-gray-200'
                  }`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isDark ? 'bg-white/5' : 'bg-gray-100'
                        }`}>
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`font-medium ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {user.email}
                          </p>
                          {user.username && (
                            <p className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              @{user.username}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? isDark
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-green-100 text-green-800'
                          : isDark
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status === 'active' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {lastLogin ? (
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <div>
                            <p className={`text-sm ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              {new Date(lastLogin.timestamp).toLocaleString()}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                {lastLogin.ip}
                              </span>
                              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                {lastLogin.browser}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          No login history
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                          className={`p-2 rounded-lg ${
                            isDark
                              ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {menuOpen === user.id && (
                          <div className={`absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-10 ${
                            isDark
                              ? 'bg-gray-800 border-white/10'
                              : 'bg-white border-gray-200'
                          }`}>
                            <button
                              onClick={() => {
                                setSelectedUser(selectedUser === user.id ? null : user.id);
                                setMenuOpen(null);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm ${
                                isDark
                                  ? 'text-gray-300 hover:bg-white/10'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              View Activity
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className={`w-full text-left px-4 py-2 text-sm text-red-600 ${
                                isDark
                                  ? 'hover:bg-white/10'
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Activity Log Panel */}
                  {selectedUser === user.id && user.logs.activities.length > 0 && (
                    <tr className={isDark ? 'bg-white/5' : 'bg-gray-50'}>
                      <td colSpan={4} className="p-4">
                        <div className="space-y-3">
                          <h4 className={`font-medium ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            Activity Log
                          </h4>
                          <div className="space-y-2">
                            {user.logs.activities.map((activity, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg ${
                                  isDark ? 'bg-black/20' : 'bg-white'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Monitor className={`w-4 h-4 ${
                                      isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`} />
                                    <div>
                                      <p className={`text-sm font-medium ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                      }`}>
                                        {activity.type.replace(/_/g, ' ').toUpperCase()}
                                      </p>
                                      <p className={`text-xs ${
                                        isDark ? 'text-gray-400' : 'text-gray-600'
                                      }`}>
                                        {activity.browser} on {activity.os} ({activity.device})
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className={`text-sm ${
                                      isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      {activity.ip}
                                    </p>
                                    <p className={`text-xs ${
                                      isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                      {new Date(activity.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
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