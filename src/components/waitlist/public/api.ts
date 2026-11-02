import axios from 'axios';

export interface FormField {
  type: string;
  label: string;
  required: boolean;
}

export interface SignupForm {
  backgroundColor?: string;
  buttonText?: string;
  customHTML?: string;
  description?: string;
  fields: FormField[];
  isCustomEnabled?: boolean;
  logo?: string;
  successMessage?: string;
  title?: string;
}

export interface WaitlistForms {
  signup_form: SignupForm | null;
  verification_form: any | null;
  referral_form: any | null;
}

const API_URL = 'https://api-eight-navy-68.vercel.app/api/waitlist';

export const waitlistPublicApi = {
  async getForms(projectId: string): Promise<WaitlistForms> {
    try {
      const response = await axios.get(`${API_URL}/${projectId}/forms`);
      return response.data.forms;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch forms');
      }
      throw error;
    }
  },

  async joinWaitlist(projectId: string, email: string, referralCode?: string) {
    try {
      const response = await axios.post(`${API_URL}/${projectId}/join`, {
        email,
        referralCode
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to join waitlist');
      }
      throw error;
    }
  }
};