import { useState } from 'react';
import { resetService } from '../services/reset.service';

interface UseResetPassword {
  isLoading: boolean;
  error: string;
  initiateReset: (email: string) => Promise<void>;
  completeReset: (token: string, newPassword: string) => Promise<void>;
}

export const useResetPassword = (): UseResetPassword => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const initiateReset = async (email: string) => {
    try {
      setIsLoading(true);
      setError('');
      await resetService.initiateReset(email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const completeReset = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError('');
      await resetService.completeReset(token, newPassword);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    initiateReset,
    completeReset
  };
};