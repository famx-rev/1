import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Clock, Shield, LogOut, 
  CheckCircle, AlertCircle, Users,
  LineChart, Key, ExternalLink
} from 'lucide-react';
import { authService } from '../services/auth.service';
import { useTheme } from '../contexts/ThemeContext';

interface UserData {
  id: string;
  username: string;
  email: string;
  ipHistory: Array<{
    ip: string;
    timestamp: string;
  }>;
}

export const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('https://api-eight-navy-68.vercel.app/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const services = [
    {
      title: 'Waitlist Management',
      icon: Users,
      status: 'active',
      description: 'Manage your waitlist campaigns and user signups',
      color: 'blue',
      link: '/waitlist'
    },
    {
      title: '7EA Stock',
      icon: LineChart,
      status: 'active',
      description: 'Track and manage your 7EA coin investments',
      color: 'green',
      link: '/stock'
    },
    {
      title: 'Authority',
      icon: Key,
      status: 'active',
      description: 'Manage authentication and authorization',
      color: 'purple',
      link: '/authority'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-white/10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white dark-glow-sm' : 'text-gray-900'}`}>
              Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-white/5' : 'bg-white'
              } border border-gray-200 dark:border-white/10`}>
                <div className="flex items-center gap-3 mb-2">
                  <User className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile Info</h3>
                </div>
                <div className="space-y-2">
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Username: <span className="font-medium">{userData?.username}</span>
                  </p>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Email: <span className="font-medium">{userData?.email}</span>
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-white/5' : 'bg-white'
              } border border-gray-200 dark:border-white/10`}>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Security Status</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      Password protection active
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      Email verification complete
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                      Two-factor authentication available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Status */}
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-white/5' : 'bg-white'
              } border border-gray-200 dark:border-white/10`}>
              <div className="flex items-center gap-3 mb-4">
                <Clock className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Services Status</h3>
              </div>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <Link
                    key={index}
                    to={service.link}
                    className={`block p-4 rounded-lg ${
                      isDark ? 'bg-black/20 hover:bg-black/30' : 'bg-gray-50 hover:bg-gray-100'
                    } border border-gray-200 dark:border-white/5 transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <service.icon className={`w-5 h-5 text-${service.color}-500`} />
                        <div>
                          <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {service.title}
                          </h4>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          service.status === 'active'
                            ? isDark
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-green-100 text-green-800'
                            : isDark
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {service.status === 'active' ? 'Active' : 'Maintenance'}
                        </span>
                        <ExternalLink className={`w-4 h-4 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Login History */}
          <div className={`p-4 rounded-xl ${
            isDark ? 'bg-white/5' : 'bg-white'
          } border border-gray-200 dark:border-white/10`}>
            <div className="flex items-center gap-3 mb-4">
              <Clock className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Login History</h3>
            </div>
            <div className="space-y-3">
              {userData?.ipHistory?.map((entry, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    isDark ? 'bg-black/20' : 'bg-gray-50'
                  } border border-gray-200 dark:border-white/5`}
                >
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    IP: <span className="font-medium">{entry.ip}</span>
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
              {(!userData?.ipHistory || userData.ipHistory.length === 0) && (
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No login history available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};