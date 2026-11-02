import axios from 'axios';
import { Product } from './api';

const API_URL = 'https://api-eight-navy-68.vercel.app/api/universex/marketplace';

export const productShowApi = {
  async getAllProducts(): Promise<Product[]> {
    try {
      // Try to get from cache first
      const cached = localStorage.getItem('mlist');
      if (cached) {
        return JSON.parse(cached);
      }

      const response = await axios.get(`${API_URL}/list-all`);
      
      // Cache the response
      localStorage.setItem('mlist', JSON.stringify(response.data.products));
      
      return response.data.products;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch products');
      }
      throw error;
    }
  },

  async getUserProducts(): Promise<Product[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Try to get from cache first
      const cached = localStorage.getItem('mlist-p');
      if (cached) {
        return JSON.parse(cached);
      }

      const response = await axios.get(`${API_URL}/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Cache the response
      localStorage.setItem('mlist-p', JSON.stringify(response.data.products));

      return response.data.products;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user products');
      }
      throw error;
    }
  }
};