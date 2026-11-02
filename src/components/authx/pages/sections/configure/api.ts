import axios from 'axios';

const API_URL = 'https://api-eight-navy-68.vercel.app/api/authx/configure';

export interface ConfigureData {
  branding?: {
    appName?: string;
    logoUrl?: string;
    primaryColor?: string;
    description?: string;
  };
  auth?: {
    emailAuthEnabled?: boolean;
    phoneAuthEnabled?: boolean;
    usernameEnabled?: boolean;
    mfaEnabled?: boolean;
    sessionDuration?: string;
  };
  oauth?: {
    redirectUris?: string[];
    allowedScopes?: string[];
  };
}

export const configureApi = {
  async getConfiguration(appId: string): Promise<ConfigureData> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/${appId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data.config;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch configuration');
      }
      throw error;
    }
  },

  async updateConfiguration(appId: string, data: ConfigureData): Promise<ConfigureData> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(`${API_URL}/${appId}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.config;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update configuration');
      }
      throw error;
    }
  },

  async resetConfiguration(appId: string): Promise<ConfigureData> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_URL}/${appId}/reset`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data.config;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to reset configuration');
      }
      throw error;
    }
  }
};