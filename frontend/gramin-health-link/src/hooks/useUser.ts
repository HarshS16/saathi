// @/hooks/useUser.ts

// DEMO MODE: This file is modified to bypass API calls for development.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';

const demoUserProfile = {
  name: 'Rani Sharma',
  phone: '9876543210',
  email: 'rani.sharma@example.com',
  dateOfBirth: '1995-08-15',
  gender: 'female',
  bloodGroup: 'O+',
  address: '123, Village Road, Haryana',
  emergencyContact: '1234567890',
  emergencyContactName: 'Raj Singh',
  medicalHistory: 'None',
  allergies: 'Peanuts',
  currentMedications: 'None',
};

// Hook for fetching user profile
export const useUserProfile = () => {
  return {
    data: demoUserProfile,
    isLoading: false,
    error: null,
  };
};

// Hook for updating user profile
export const useUpdateUserProfile = () => {
  return {
    mutate: (userData: any, { onSuccess }: any) => {
      console.log('DEMO: Updating user profile', userData);
      toast.success('Profile updated successfully (DEMO)');
      if (onSuccess) {
        onSuccess();
      }
    },
    isPending: false,
  };
};

// Hook for submitting credentials (for doctors)
export const useSubmitCredentials = () => {
  return {
    mutate: (formData: FormData) => {
      console.log('DEMO: Submitting credentials', formData);
      toast.success('Credentials submitted successfully (DEMO)');
    },
    isPending: false,
  };
};