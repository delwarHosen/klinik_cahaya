import { baseApi } from '@/redux/baseApi';

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointmentsByPhone: builder.query({
      query: (phone: string) => `/appointments/patient/phone?phone=${phone}`,
    }),
  }),
  overrideExisting: true,
});

export const { useGetAppointmentsByPhoneQuery } = appointmentsApi;