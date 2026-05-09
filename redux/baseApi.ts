import { showToast } from '@/components/shared/Toast';
import { logout } from '@/redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { router } from 'expo-router';

const baseQuery = fetchBaseQuery({
  // baseUrl: 'https://v0d7xzkk-7000.inc1.devtunnels.ms',
  baseUrl: 'http://10.10.20.46:7000',
  prepareHeaders: async (headers) => {
    return headers;
  },
});

const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {

  const token = await AsyncStorage.getItem('access_token');
  // console.log('🔑 Token:', token);
  // console.log('📍 URL:', typeof args === 'string' ? args : args?.url);

  const modifiedArgs =
    typeof args === 'string'
      ? { url: args, headers: token ? { Authorization: `Bearer ${token}` } : {} }
      : {
          ...args,
          headers: {
            ...(args.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        };

  const result = await baseQuery(modifiedArgs, api, extraOptions);

  if (result.error) {
    const status = (result.error as FetchBaseQueryError).status;
    const data = result.error.data as any;
    const message = data?.message || data?.error || getErrorMessage(status);

    const url = typeof args === 'string' ? args : args?.url || '';
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/signup') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/onboarding');

    if (status === 401 && !isAuthEndpoint) {
      showToast('Session expired. Please login again.', 'error');
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'role']);
      api.dispatch(logout());
      router.replace('/(auth)/login');
      return result;
    }

    if (!isAuthEndpoint) {
      showToast(message, 'error');
    }
  }

  return result;
};

function getErrorMessage(status: number | string): string {
  switch (status) {
    case 400: return 'Invalid request.';
    case 401: return 'Session expired. Please login again.';
    case 403: return "You don't have permission.";
    case 404: return 'Resource not found.';
    case 422: return 'Validation failed.';
    case 500: return 'Server error. Try again later.';
    case 'FETCH_ERROR': return 'No internet connection.';
    case 'TIMEOUT_ERROR': return 'Request timed out.';
    default: return 'Something went wrong.';
  }
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Auth','Profile', 'Patient', 'Admin', 'Appointments', 'Doctors', 'Queue','DoctorAvailability','AppointmentMembers','AdminUpcoming', 'AdminBookingRequest', 'AdminBookingCount','AdminFilteredBookings','AdminFilteredAppointments'], 
  endpoints: () => ({}),
});