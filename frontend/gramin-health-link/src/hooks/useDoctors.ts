// @/hooks/useDoctors.ts

// DEMO MODE: This file is modified to bypass API calls for development.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';

const demoDoctors = [
  {
    _id: 'doc-1',
    name: 'Dr. Anil Kumar',
    specialty: 'Cardiology',
    rating: 4.8,
    experience: '15 years',
    location: 'Delhi, India',
    available: true,
    nextSlot: '11:00 AM',
    consultationFee: 800,
  },
  {
    _id: 'doc-2',
    name: 'Dr. Sunita Sharma',
    specialty: 'Dermatology',
    rating: 4.9,
    experience: '12 years',
    location: 'Mumbai, India',
    available: false,
    nextSlot: 'Tomorrow',
    consultationFee: 1000,
  },
  {
    _id: 'doc-3',
    name: 'Dr. Rajesh Gupta',
    specialty: 'General Physician',
    rating: 4.7,
    experience: '10 years',
    location: 'Bangalore, India',
    available: true,
    nextSlot: '04:00 PM',
    consultationFee: 500,
  },
];

// Hook for fetching all doctors
export const useDoctors = () => {
  return {
    data: demoDoctors,
    isLoading: false,
    error: null,
  };
};

// Hook for fetching doctor details
export const useDoctorDetails = (doctorId: string) => {
  const doctor = demoDoctors.find(d => d._id === doctorId) || demoDoctors[0];
  return {
    data: doctor,
    isLoading: false,
    error: null,
  };
};

// Hook for fetching doctor schedule
export const useDoctorSchedule = () => {
  return {
    data: {
      slots: [
        { time: '10:00 AM', available: true },
        { time: '10:30 AM', available: false },
        { time: '11:00 AM', available: true },
      ]
    },
    isLoading: false,
    error: null,
  };
};

// Hook for adding a new slot
export const useAddSlot = () => {
  return {
    mutate: (slotData: any) => {
      console.log('DEMO: Adding slot', slotData);
      toast.success('Slot added successfully (DEMO)');
    },
  };
};