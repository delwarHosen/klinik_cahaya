import { baseApi } from '@/redux/baseApi';

export interface UpdateAppointmentRequest {
  appointmentId: string;
  status: string;
  reschedule_suggestion?: string | null;
  reschedule_state?: string | null;
  reschedule_data?: { date: string; time: string } | null;
  appt_date?: string;  
  appt_time?: string; 
}

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

    updateAppointment: builder.mutation<any, UpdateAppointmentRequest>({
      query: ({ appointmentId, ...body }) => ({
        url: `/approval/appointments/pending/${appointmentId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Appointments'],
    }),

  }),
  overrideExisting: true,
});

export const {
  useGetAppointmentsByPhoneQuery,
  useUpdateAppointmentMutation,
} = appointmentsApi;