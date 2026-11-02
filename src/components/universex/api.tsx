import axios from 'axios';

const API_URL = 'https://api-eight-navy-68.vercel.app/api/x';

export interface Product {
  id: string;
  name: string;
  description: string;
  type: 'api' | 'website' | 'service';
  price: string;
  category: string;
  tags: string[];
  visibility: 'public' | 'private';
  status: 'draft' | 'published';
  documentation?: string;
  apiEndpoint?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductStats {
  totalRequests: number;
  dailyRequests: number;
  avgLatency: number;
  successRate: number;
}

export const universeXApi = {
  async createProduct(data: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_URL}/create`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create product');
      }
      throw error;
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch products');
      }
      throw error;
    }
  },

  async getProduct(id: string): Promise<Product> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch product');
      }
      throw error;
    }
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(`${API_URL}/products/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update product');
      }
      throw error;
    }
  },

  async getProductStats(id: string): Promise<ProductStats> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/products/${id}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch product stats');
      }
      throw error;
    }
  }
};