import { baseApi } from '@/redux/baseApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppointmentMember {
  id: string;
  type: 'self' | 'family';
  name: string;
  ic_number: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  relationship: string;
  yezza_patient_id?: number;
}

export interface MembersResponse {
  count: number;
  members: AppointmentMember[];
}

export interface AvailabilitySlot {
  date: string;    // "2026-05-07"
  day: string;     // "Thursday"
  slots: string[]; // ["20:00", "20:30"]
}

export interface DoctorAvailabilityResponse {
  doctor: {
    id: string;
    name: string;
    doctor_phone: string;
    tier: number;
    active: boolean;
    provider_id: number;
    service_id: number;
    consultation_days: string;
    consultation_time: string;
  };
  range: {
    from: string;
    to: string;
    slot_minutes: number;
  };
  availability: AvailabilitySlot[];
}

export interface CreateAppointmentPayload {
  date: string;            // "2026-05-07"
  time: string;            // "20:00"
  doctor_id: string;
  reason: string;
  member_id?: string | null;    // self booking → member_id
  member_name?: string | null;  // family booking → member_name
}

export interface CreateAppointmentResponse {
  success: boolean;
  appointment_id?: string;
  message?: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /fresh/appointment-members
    getAppointmentMembers: builder.query<MembersResponse, void>({
      query: () => '/fresh/appointment-members',
      providesTags: ['AppointmentMembers'],
      keepUnusedDataFor: 300,
    }),

    // GET /fresh/doctors/:doctor_id/availability
    getDoctorAvailability: builder.query<DoctorAvailabilityResponse, string>({
      query: (doctorId) => `/fresh/doctors/${doctorId}/availability`,
      providesTags: (result, error, doctorId) => [
        { type: 'DoctorAvailability', id: doctorId },
        'DoctorAvailability',
      ],
      keepUnusedDataFor: 120,
    }),

    // POST /fresh/appointments
    createAppointment: builder.mutation<CreateAppointmentResponse, CreateAppointmentPayload>({
      query: (body) => ({
        url: '/fresh/appointments',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'DoctorAvailability', id: arg.doctor_id },
        'DoctorAvailability',
        'Appointments',  // apointment list refetch হবে
      ],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetAppointmentMembersQuery,
  useGetDoctorAvailabilityQuery,
  useCreateAppointmentMutation,
} = bookingApi;