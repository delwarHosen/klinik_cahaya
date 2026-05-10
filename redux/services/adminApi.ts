import { baseApi } from '@/redux/baseApi';

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

// doctor_phone সরানো হয়েছে
export interface AdvancedFilterParams {
  status?: string;
  doctor_ids?: string;
  start_date?: string;
  end_date?: string;
}

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

export interface StatusChangeRequest {
  booking_id: string;
  status: 'confirmed' | 'rejected';
}


export interface RescheduleRequest {
  booking_id: string;
  appt_date: string;        // "YYYY-MM-DD"
  appt_time: string;        // "HH:MM"
  reschedule_suggestion: string;
}

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
          ...(params.start_date && { start_date: params.start_date }),
          ...(params.end_date && { end_date: params.end_date }),
        },
      }),
      providesTags: ['AdminFilteredBookings'],
      keepUnusedDataFor: 0,
      forceRefetch: () => true,
    }),

    getBookingLookupQuery: builder.query<BookingLookupResponse, string>({
      query: (booking_id) => ({
        url: '/admin/booking/Lookup',
        method: 'POST',
        body: { booking_id },
      }),
      providesTags: (result, error, booking_id) => [
        { type: 'AdminBookingRequest' as const, id: booking_id },
      ],
      keepUnusedDataFor: 300,
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
      keepUnusedDataFor: 0,
      forceRefetch: () => true,
    }),

    getAppointmentLookup: builder.mutation<AppointmentLookupResponse, AppointmentLookupRequest>({
      query: (body) => ({
        url: '/admin/appointment/lookup',
        method: 'POST',
        body,
      }),
    }),

    // status changes
    getStatusChanges: builder.mutation<any, StatusChangeRequest>({
      query: (body) => ({
        url: '/admin/booking',
        method: 'PATCH',
        body,
      }),
    }),

    // reschedule
    rescheduleBooking: builder.mutation<any, RescheduleRequest>({
      query: (body) => ({
        url: '/admin/reschedule',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AdminBookingRequest', 'AdminFilteredBookings'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetUpcomingAppointmentsQuery,
  useGetBookingRequestsQuery,
  useGetBookingCountQuery,
  useGetFilteredBookingsQuery,
  useGetBookingLookupQueryQuery,
  useGetBookingLookupMutation,
  useGetFilteredAppointmentsQuery,
  useGetAppointmentLookupMutation,
  useGetStatusChangesMutation,
  useRescheduleBookingMutation
} = adminApi;



