import { baseApi } from '@/redux/baseApi';

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /appointments/patient/phone?phone=xxx
    getAppointmentsByPhone: builder.query({
      query: (phone: string) => `/approval/appointments/patient`,
      // Use the generic 'Appointments' tag so createAppointment's
      // invalidatesTags: ['Appointments'] triggers a refetch here
      providesTags: ['Appointments'],
      keepUnusedDataFor: 300,
    }),

  }),
  overrideExisting: true,
});

export const { useGetAppointmentsByPhoneQuery } = appointmentsApi;