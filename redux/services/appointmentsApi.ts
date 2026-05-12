import { baseApi } from '@/redux/baseApi';

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAppointmentsByPhone: builder.query({
      query: (phone: string) => ({
        url: '/appointments/patient/appointment',
        method: 'GET',
        params: { phone },
      }),
      providesTags: ['Appointments'],
      keepUnusedDataFor: 0,
    }),

    // Cancel/Reject
    rejectAppointment: builder.mutation<any, { appointmentId: string }>({
      query: ({ appointmentId }) => ({
        url: `/approval/patient/${appointmentId}/reject`,
        method: 'POST',
      }),
      invalidatesTags: ['Appointments'],
    }),

    // Reschedule
    rescheduleAppointment: builder.mutation<any, {
      appointmentId: string;
      appt_date: string;
      appt_time: string;
      reschedule_suggestion?: string;
    }>({
      query: ({ appointmentId, ...body }) => ({
        url: `/approval/patient/${appointmentId}/reschedule`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),

  }),
  overrideExisting: true,
});

export const {
  useGetAppointmentsByPhoneQuery,
  useRejectAppointmentMutation,
  useRescheduleAppointmentMutation,
} = appointmentsApi;