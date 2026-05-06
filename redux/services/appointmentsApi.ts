import { baseApi } from '@/redux/baseApi';

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /appointments/patient/phone?phone=xxx
    getAppointmentsByPhone: builder.query({
      query: (phone: string) => `/appointments/patient/phone?phone=${phone}`,
      providesTags: (result, error, phone) => [
        { type: 'Appointments', id: phone },
      ],
      keepUnusedDataFor: 300, // 5 মিনিট cache
    }),

  }),
  overrideExisting: true,
});

export const { useGetAppointmentsByPhoneQuery } = appointmentsApi;