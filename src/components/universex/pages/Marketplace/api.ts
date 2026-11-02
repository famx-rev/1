import axios from 'axios';

const API_URL = 'https://api-eight-navy-68.vercel.app/api/universex/marketplace';

export interface ProductData {
  name: string;
  description: string;
  type: 'api' | 'website' | 'service';
  price: string;
  category: string;
  tags: string[];
  visibility: 'private' | 'public';
  documentation?: string;
  apiEndpoint?: string;
}

export interface Product extends ProductData {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const productApi = {
  async createProduct(data: ProductData): Promise<Product> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(`${API_URL}/new`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.product;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create product');
      }
      throw error;
    }
  },

  async updateProduct(id: string, data: Partial<ProductData>): Promise<Product> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(`${API_URL}/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.product;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update product');
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

      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data.product;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch product');
      }
      throw error;
    }
  }
};