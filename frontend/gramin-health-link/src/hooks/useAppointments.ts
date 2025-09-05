// @/hooks/useAppointments.ts

// DEMO MODE: This file is modified to bypass API calls for development.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { toast } from 'sonner';

const demoAppointments = [
  {
    _id: 'appt-1',
    doctor: {
      name: 'Dr. Anil Kumar',
      specialty: 'Cardiology',
    },
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    time: '10:30 AM',
    status: 'confirmed',
  },
  {
    _id: 'appt-2',
    doctor: {
      name: 'Dr. Sunita Sharma',
      specialty: 'Dermatology',
    },
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    time: '02:00 PM',
    status: 'completed',
  },
  {
    _id: 'appt-3',
    doctor: {
        name: 'Dr. Rajesh Gupta',
        specialty: 'General Physician',
    },
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    time: '11:00 AM',
    status: 'cancelled',
    },
];

// Hook for fetching appointments
export const useAppointments = () => {
  return {
    data: demoAppointments,
    isLoading: false,
    error: null,
  };
};

// Hook for booking an appointment
export const useBookAppointment = () => {
  return {
    mutate: (appointmentData: any, { onSuccess }: any) => {
      console.log('DEMO: Booking appointment', appointmentData);
      toast.success('Appointment booked successfully (DEMO)');
      // Immediately call onSuccess to simulate a successful booking
      if (onSuccess) {
        onSuccess();
      }
    },
    isPending: false,
  };
};