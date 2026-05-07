import { baseApi } from '@/redux/baseApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminAppointment {
  id: number;
  start: string;
  until: string;
  status: string;
  lead: {
    id: number;
    name: string;
    phone: string;
    remarks: string;
  };
  provider: {
    id: number;
    name: string;
    type: string;
    profile_image: { file: string } | null;
  };
  services: {
    id: number;
    name: string;
    price: number;
  }[];
}

export interface FetchUpcomingResponse {
  count: number;
  results: AdminAppointment[];
}

export interface BookingRequest {
  id: string;
  appointment_id: string | null;
  patient_phone: number;
  patient_name: string;
  patient_ic: string;
  doctor_phone: number;
  doctor_name: string;
  provider_id: number;
  service_id: number;
  appt_date: string;
  appt_time: string;
  reason: string;
  status: string;
  created_at: string;
  reschedule_suggestion: any | null;
  reschedule_state: any | null;
  reschedule_data: any | null;
  approved_by: string | null;
  approved_at: string | null;
}

export interface BookingRequestResponse {
  count: number;
  results: BookingRequest[];
}

export interface BookingCountResponse {
  status_counts: {
    confirmed: number;
    rejected: number;
    expired: number;
    rescheduled: number;
    pending: number;
  };
  total: number;
  total_booking: {
    last_7_days: number;
    last_30_days: number;
    last_365_days: number;
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /admin/fetch_upcoming
    getUpcomingAppointments: builder.query<FetchUpcomingResponse, void>({
      query: () => '/admin/fetch_upcoming',
      providesTags: ['AdminUpcoming'],
      keepUnusedDataFor: 120,
    }),

    // GET /admin/booking_request
    getBookingRequests: builder.query<BookingRequestResponse, void>({
      query: () => '/admin/booking_request',
      providesTags: ['AdminBookingRequest'],
      keepUnusedDataFor: 120,
    }),

    // GET /admin/booking_count
    getBookingCount: builder.query<BookingCountResponse, void>({
      query: () => '/admin/booking_count',
      providesTags: ['AdminBookingCount'],
      keepUnusedDataFor: 120,
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetUpcomingAppointmentsQuery,
  useGetBookingRequestsQuery,
  useGetBookingCountQuery,
} = adminApi;