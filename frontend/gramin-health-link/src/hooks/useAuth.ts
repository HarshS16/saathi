// @/hooks/useAuth.ts

// DEMO MODE: This file is modified to bypass authentication for development.
// The original file content is commented out below.

import { useCallback } from 'react';

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: 'patient' | 'doctor' | 'pharmacist';
  avatar?: string;
}

// --- Hardcoded User Data ---
// Choose a user role to simulate by uncommenting one of the following blocks.
// You can customize the details as needed.

// --- PATIENT (COMMENTED OUT) ---
/*
const demoUser: User = {
  id: 'patient-123',
  phone: '9876543210',
  name: 'Rani Sharma',
  email: 'rani.sharma@example.com',
  role: 'patient',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};
*/

// --- DOCTOR (DEFAULT) ---
const demoUser: User = {
  id: 'doctor-456',
  phone: '9876543211',
  name: 'Dr. Anil Kumar',
  email: 'anil.kumar@example.com',
  role: 'doctor',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
};

// --- PHARMACIST ---
/*
const demoUser: User = {
  id: 'pharmacist-789',
  phone: '9876543212',
  name: 'Sunita Devi',
  email: 'sunita.devi@example.com',
  role: 'pharmacist',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
};
*/


export function useAuth() {
  const logout = useCallback(() => {
    // In demo mode, logout does nothing but log to the console.
    console.log('Logout function called. In a real app, this would clear user session.');
  }, []);

  // All other auth functions are mocked and do nothing.
  const login = useCallback(() => Promise.resolve(null), []);
  const requestOTP = useCallback(() => Promise.resolve({ success: true }), []);
  const verifyOTP = useCallback(() => Promise.resolve({ success: true }), []);
  const loginWithGoogle = useCallback(() => Promise.resolve({ success: true }), []);

  return {
    user: demoUser,
    isAuthenticated: true, // Always authenticated in demo mode
    isLoading: false,      // Never loading in demo mode
    token: 'fake-jwt-token-for-demo-mode',
    login,
    logout,
    requestOTP,
    verifyOTP,
    loginWithGoogle,
  };
}


/*
// >>>>> ORIGINAL FILE CONTENT <<<<<
// The original code is preserved here for easy restoration.

import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '@/services/api';

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: 'patient' | 'doctor' | 'pharmacist';
  avatar?: string;
}

export function useAuth() {
  console.log('🔄 useAuth hook initialized - NEW VERSION LOADED');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    apiClient.setToken(null);
    setToken(null);
  }, []);

  const decodeAndSetUser = useCallback((token: string) => {
    try {
      const decoded: User = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      // Clear invalid token and reset state
      apiClient.setToken(null);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  const login = useCallback((token: string, userData?: User) => {
    console.log('🔑 Login called with token and userData:', { token: token.substring(0, 20) + '...', userData });
    apiClient.setToken(token);
    setToken(token);
    
    if (userData) {
      // Use provided user data
      console.log('👤 Setting user from provided data:', userData);
      setUser(userData);
      setIsAuthenticated(true);
      console.log('✅ Authentication state updated');
      return userData;
    } else {
      // Try to decode from JWT (fallback)
      console.log('🔍 Decoding user from JWT token');
      const decodedUser = decodeAndSetUser(token);
      return decodedUser;
    }
  }, [decodeAndSetUser]);

  const requestOTP = useCallback(async (mobile: string) => {
    return await apiClient.requestOTP(mobile);
  }, []);

  const verifyOTP = useCallback(async (mobile: string, otp: string) => {
    console.log('🔐 Verifying OTP for:', mobile);
    const response = await apiClient.verifyOTP(mobile, otp);
    console.log('🔐 OTP Verification Response:', response);
    
    if (response.success && response.data?.token) {
      console.log('✅ OTP verification successful, token received');
      
      // Set user data from the response (not from JWT)
      if (response.data.user) {
        const userData = {
          id: response.data.user.id,
          phone: mobile, // Use the mobile from the request
          name: response.data.user.name,
          role: response.data.user.role
        };
        console.log('👤 Setting user data:', userData);
        login(response.data.token, userData);
        console.log('🎉 Login completed successfully');
      } else {
        console.log('⚠️ No user data in response, falling back to JWT decoding');
        // Fallback to JWT decoding if no user data
        login(response.data.token);
      }
    } else {
      console.log('❌ OTP verification failed:', response.error);
    }
    return response;
  }, [login]);

  const loginWithGoogle = useCallback(async (credential: string) => {
    console.log('🔑 Logging in with Google credential');
    const response = await apiClient.verifyGoogleCredential(credential);
    console.log('🔑 Google Login Response:', response);
    
    if (response.success && response.data?.token) {
      console.log('✅ Google login successful, token received');
      
      const userData = {
        id: response.data.user.id,
        phone: response.data.user.phone || '',
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role,
        avatar: response.data.user.avatar
      };
      
      console.log('👤 Setting Google user data:', userData);
      login(response.data.token, userData);
      console.log('🎉 Google login completed successfully');
    } else {
      console.log('❌ Google login failed:', response.error);
    }
    return response;
  }, [login]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('sehat-saathi-token');
      if (storedToken) {
        setToken(storedToken);
        apiClient.setToken(storedToken);
        
        try {
          // Try to decode the token to get user ID
          const decoded = jwtDecode(storedToken);
          if (decoded.id) {
            // Fetch user data from backend
            const response = await apiClient.getMe();
            if (response.success && response.data) {
              const userData = {
                id: response.data._id || response.data.id,
                phone: response.data.phone,
                name: response.data.name,
                role: response.data.role
              };
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              // If fetching user data fails, clear the token
              logout();
            }
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [logout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
    requestOTP,
    verifyOTP,
    loginWithGoogle,
  };
}
*/