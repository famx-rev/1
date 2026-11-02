import axios from 'axios';

const API_URL = 'https://api-eight-navy-68.vercel.app/api/mail/reset';

export interface ResetResponse {
  message: string;
  email?: string;
}

export const resetService = {
  async initiateReset(email: string): Promise<ResetResponse> {
    try {
      const response = await axios.get(`${API_URL}/f/${email}`);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to initiate password reset');
      }
      throw error;
    }
  },

  async completeReset(token: string, newPassword: string): Promise<ResetResponse> {
    try {
      const response = await axios.post(`${API_URL}/reset`, {
        token,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to reset password');
      }
      throw error;
    }
  }
};