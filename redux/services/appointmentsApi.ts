import { baseApi } from '@/redux/baseApi';

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /appointments/patient/appointment?phone=xxx
    getAppointmentsByPhone: builder.query({
      query: (phone: string) => ({
        url: '/appointments/patient/appointment',
        method: 'GET',
        params: { phone },
      }),
      providesTags: ['Appointments'],
      keepUnusedDataFor: 300,
    }),

  }),
  overrideExisting: true,
});

export const { useGetAppointmentsByPhoneQuery } = appointmentsApi;