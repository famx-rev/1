import axios from 'axios';

const API_URL = 'https://api-eight-navy-68.vercel.app/api/waitlist';

export interface WaitlistUser {
  id: string;
  email: string;
  status: string;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
  referral_count: number;
}

export const waitlistApi = {
  async getUsers(projectId: string): Promise<WaitlistUser[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/${projectId}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data.users;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch waitlist users');
      }
      throw error;
    }
  }
};