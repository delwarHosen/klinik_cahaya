import { baseApi } from '@/redux/baseApi';

// ─── Existing Types ────────────────────────────────────────────────────────────

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

// ─── Booking Filter Params ─────────────────────────────────────────────────────

export interface AdvancedFilterParams {
  status?: string;
  doctor_ids?: string;
  doctor_phone?: string;
  start_date?: string;
  end_date?: string;
}

// ─── Booking Lookup ────────────────────────────────────────────────────────────

export interface BookingLookupRequest {
  booking_id: string;
}

export interface BookingLookupResponse {
  booking: BookingRequest;
  doctor: {
    id: string;
    name: string;
    full_name: string;
    designation: string;
    specialization: string;
    tier: number;
    active: boolean;
    consultation_days: string;
    consultation_time: string;
    about: string;
    specialties: string;
    avatar_url: string;
    yezza_provider_id: number;
    yezza_service_id: number;
    doctor_phone: number;
  };
  patient: {
    patient: any | null;
    onboarding: any | null;
    requested_patient: {
      name: string;
      phone: number;
      ic: string;
    };
  };
}

// ─── Appointment Fetch All ───────────────────────────────────────────────

export interface AppointmentFilterParams {
  category?: 'all' | 'upcoming' | 'completed' | 'cancelled';
  doctor_ids?: string;
  start_date?: string;
  end_date?: string;
}

export interface AppointmentLead {
  id: number;
  pid: string;
  rid: string;
  phone: string | null;
  name: string;
  taggings: any[];
  remarks: string | null;
  ic?: string; 
  email?: string;
}

export interface AppointmentProvider {
  id: number;
  name: string;
  type: string;
  profile_image: { file: string } | null;
}

export interface AppointmentService {
  id: number;
  leadproduct: number;
  name: string;
  price: number;
  paid: boolean;
}

export interface AppointmentItem {
  id: number;
  created: string;
  start: string | null;
  until: string | null;
  preset_date: string | null;
  time_range: [string, string] | null;
  type: string;
  status: string;
  patient: number;
  paid: null | boolean;
  lead: AppointmentLead;
  provider: AppointmentProvider;
  services: AppointmentService[];
  combo_set: any[];
}

export interface AppointmentFetchAllResponse {
  count: number;
  results: AppointmentItem[];
}

// ─── Appointment Lookup (Slightly Updated to handle UI logic) ────────────────

export interface AppointmentLookupRequest {
  appointment_id: string;
}

export interface AppointmentLookupResponse {
  appointment: {
    id: number;
    date: string;
    time: string;
    start: string;
    until: string;
    status: string;
    patient: {
      id: number;
      name: string;
      phone: string;
      ic: string;
      email: string;
    };
    lead: AppointmentLead;
    provider: AppointmentProvider;
    services: AppointmentService[];
    booked_by?: {
      first_name: string;
      last_name: string;
    };
  };
  normalized_appointment: {
    id: string;
    display_datetime: string;
    display_status: string;
    status: string;
    raw_status: string;
    reason: string | null;
    doctor_name: string;
    patient_name: string;
    patient_for?: string; 
    visit_reason_detail?: string | null;
  };
  doctor: {
    id: string;
    name: string;
    full_name: string;
    designation: string;
    specialization: string;
    tier: number;
    active: boolean;
    consultation_days: string;
    consultation_time: string;
    about: string;
    specialties: string;
    avatar_url: string;
    yezza_provider_id: number;
    yezza_service_id: number;
    doctor_phone: number;
  };
  patient: {
    patient: any | null;
    onboarding: any | null;
    yezza_patient_id: {
      id: number;
      name: string;
      phone: string;
      ic: string;
      email: string;
    } | null;
    lead: AppointmentLead;
    normalized_patient: {
      patient_for: string;
      patient_name: string;
      booked_by_name: string;
      booked_by_phone: string;
    };
  };
}

// ─── API Implementation ────────────────────────────────────────────────────────

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUpcomingAppointments: builder.query<FetchUpcomingResponse, void>({
      query: () => '/admin/fetch_upcoming',
      providesTags: ['AdminUpcoming'],
      keepUnusedDataFor: 120,
    }),

    getBookingRequests: builder.query<BookingRequestResponse, void>({
      query: () => '/admin/booking_request',
      providesTags: ['AdminBookingRequest'],
      keepUnusedDataFor: 120,
    }),

    getBookingCount: builder.query<BookingCountResponse, void>({
      query: () => '/admin/booking_count',
      providesTags: ['AdminBookingCount'],
      keepUnusedDataFor: 120,
    }),

    getFilteredBookings: builder.query<BookingRequestResponse, AdvancedFilterParams>({
      query: (params) => ({
        url: '/admin/booking_fetch_all/advanced_filter',
        method: 'GET',
        params: {
          ...(params.status && { status: params.status }),
          ...(params.doctor_ids && { doctor_ids: params.doctor_ids }),
          ...(params.doctor_phone && { doctor_phone: params.doctor_phone }),
          ...(params.start_date && { start_date: params.start_date }),
          ...(params.end_date && { end_date: params.end_date }),
        },
      }),
      providesTags: ['AdminFilteredBookings'],
      keepUnusedDataFor: 60,
    }),

    getBookingLookup: builder.mutation<BookingLookupResponse, BookingLookupRequest>({
      query: (body) => ({
        url: '/admin/booking/Lookup',
        method: 'POST',
        body,
      }),
    }),

    getFilteredAppointments: builder.query<AppointmentFetchAllResponse, AppointmentFilterParams>({
      query: (params) => ({
        url: '/admin/appointment_fetch_all/advanced_filter',
        method: 'GET',
        params: {
          category: params.category ?? 'all',
          ...(params.doctor_ids && { doctor_ids: params.doctor_ids }),
          ...(params.start_date && { start_date: params.start_date }),
          ...(params.end_date && { end_date: params.end_date }),
        },
      }),
      providesTags: ['AdminFilteredAppointments'],
      keepUnusedDataFor: 60,
    }),

    getAppointmentLookup: builder.mutation<AppointmentLookupResponse, AppointmentLookupRequest>({
      query: (body) => ({
        url: '/admin/appointment/lookup',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUpcomingAppointmentsQuery,
  useGetBookingRequestsQuery,
  useGetBookingCountQuery,
  useGetFilteredBookingsQuery,
  useGetBookingLookupMutation,
  useGetFilteredAppointmentsQuery,
  useGetAppointmentLookupMutation,
} = adminApi;