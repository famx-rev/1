import { jwtDecode } from 'jwt-decode';

const API_URL = 'https://api-eight-navy-68.vercel.app';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  message: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please try again later.');
      }
      throw error;
    }
  },

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please try again later.');
      }
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp! * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};