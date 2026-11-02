import axios from 'axios';

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    username?: string;
  };
}

const API_URL = 'https://api-eight-navy-68.vercel.app/api/authx';

export const authxApi = {
  async login(appId: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/${appId}/user/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to login');
      }
      throw error;
    }
  },

  async signup(appId: string, email: string, password: string, username?: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/${appId}/user/signup`, {
        email,
        password,
        username
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create account');
      }
      throw error;
    }
  },

  async forgotPassword(appId: string, email: string): Promise<{ message: string; resetToken?: string }> {
    try {
      const response = await axios.post(`${API_URL}/${appId}/user/forgot-password`, {
        email
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to process password reset');
      }
      throw error;
    }
  },

  async resetPassword(appId: string, token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await axios.post(`${API_URL}/${appId}/user/reset-password`, {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to reset password');
      }
      throw error;
    }
  }
};