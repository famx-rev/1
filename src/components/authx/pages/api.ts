import axios from 'axios';

const API_URL = 'https://api-eight-navy-68.vercel.app/api/authx';

export interface App {
  id: string;
  name: string;
  type: string;
  domain?: string;
  status: string;
  configure?: {
    redirectUris?: string[];
    allowedScopes?: string[];
  };
  secret_key: string;
  user_count: number;
  created_at: string;
  updated_at: string;
  lastUpdated: string;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  allowedScopes: string[];
}

export const authxApi = {
  async getApps(): Promise<App[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/apps`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Save the response to local storage
      localStorage.setItem('authx_apps', JSON.stringify(response.data.apps));
      
      return response.data.apps;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch applications');
      }
      throw error;
    }
  },

  // Get apps from local storage
  getCachedApps(): App[] | null {
    const cached = localStorage.getItem('authx_apps');
    return cached ? JSON.parse(cached) : null;
  },

  async getApp(id: string): Promise<App> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/apps/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.app;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch application');
      }
      throw error;
    }
  },

  async createApp(data: { name: string; type: string; domain?: string }): Promise<App> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_URL}/apps`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update cached apps
      const cachedApps = this.getCachedApps() || [];
      localStorage.setItem('authx_apps', JSON.stringify([...cachedApps, response.data.app]));

      return response.data.app;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create application');
      }
      throw error;
    }
  },

  async updateApp(id: string, data: Partial<App>): Promise<App> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(`${API_URL}/apps/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update cached apps
      const cachedApps = this.getCachedApps() || [];
      const updatedApps = cachedApps.map(app => app.id === id ? response.data.app : app);
      localStorage.setItem('authx_apps', JSON.stringify(updatedApps));

      return response.data.app;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update application');
      }
      throw error;
    }
  },

  async deleteApp(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${API_URL}/apps/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update cached apps
      const cachedApps = this.getCachedApps() || [];
      const updatedApps = cachedApps.filter(app => app.id !== id);
      localStorage.setItem('authx_apps', JSON.stringify(updatedApps));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to delete application');
      }
      throw error;
    }
  },

  async getOAuthConfig(appId: string): Promise<OAuthConfig> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/oauth/config/${appId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch OAuth configuration');
      }
      throw error;
    }
  },

  async updateOAuthConfig(appId: string, config: Partial<OAuthConfig>): Promise<OAuthConfig> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(`${API_URL}/oauth/config/${appId}`, config, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.config;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update OAuth configuration');
      }
      throw error;
    }
  },

  async regenerateSecret(appId: string): Promise<string> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_URL}/oauth/secret/${appId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.clientSecret;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to regenerate client secret');
      }
      throw error;
    }
  }
};