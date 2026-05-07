// // ─── Add these to your existing adminApi.ts injectEndpoints ──────────────────
// // Paste inside the endpoints: (builder) => ({ ... }) block

// // ── Types ──────────────────────────────────────────────────────────────────

// export interface AdvancedFilterParams {
//   category?: string;      // "all" | "upcoming" | "completed" etc.
//   doctor_ids?: string;    // comma-separated e.g. "dr_faiz,dr_anis"
//   start_date?: string;    // "YYYY-MM-DD"
//   end_date?: string;      // "YYYY-MM-DD"
// }

// export interface AppointmentResult {
//   id: number;
//   created: string;
//   start: string | null;
//   until: string | null;
//   time_range: string[];
//   type: string;
//   status: string;
//   patient: number;
//   paid: boolean | null;
//   lead: {
//     id: number;
//     name: string;
//     phone: string;
//     remarks: string | null;
//   };
//   provider: {
//     id: number;
//     name: string;
//     type: string;
//     profile_image: { file: string } | null;
//   };
//   services: {
//     id: number;
//     name: string;
//     price: number;
//     paid: boolean;
//   }[];
// }

// export interface AdvancedFilterResponse {
//   count: number;
//   results: AppointmentResult[];
// }

// export interface LookupAppointmentResponse {
//   appointment: {
//     id: number;
//     start: string | null;
//     until: string | null;
//     time_range: string[];
//     status: string;
//     created: string;
//     lead: {
//       name: string;
//       phone: string;
//       remarks: string | null;
//     };
//     provider: {
//       name: string;
//       profile_image: { file: string } | null;
//     };
//     services: { name: string; price: number; paid: boolean }[];
//     patient: {
//       id: number;
//       name: string;
//       phone: string;
//       ic?: string;
//       email?: string;
//     };
//   };
//   normalized_appointment: {
//     display_datetime: string;
//     display_status: string;
//     doctor_name: string;
//     doctor_specialty: string;
//     patient_name: string;
//     reason: string | null;
//     status: string;
//   };
//   doctor: {
//     name: string;
//     specialization: string;
//     avatar_url: string;
//   };
// }

// // ── Endpoints to inject ────────────────────────────────────────────────────


//   getAppointmentsAdvancedFilter: builder.query<AdvancedFilterResponse, AdvancedFilterParams>({
//     query: (params) => {
//       const q = new URLSearchParams();
//       if (params.category)   q.set('category',   params.category);
//       if (params.doctor_ids) q.set('doctor_ids', params.doctor_ids);
//       if (params.start_date) q.set('start_date', params.start_date);
//       if (params.end_date)   q.set('end_date',   params.end_date);
//       return `/admin/appointment_fetch_all/advanced_filter?${q.toString()}`;
//     },
//     providesTags: ['Appointments'],
//     keepUnusedDataFor: 60,
//   }),

//   lookupAppointment: builder.mutation<LookupAppointmentResponse, string>({
//     query: (appointment_id) => ({
//       url: '/admin/appontment/lookup',   // keep the typo — matches API
//       method: 'POST',
//       body: { appointment_id: String(appointment_id) },
//     }),
//   })



//   export const {
//     useGetAppointmentsAdvancedFilterQuery,
//    useLookupAppointmentMutation
// //   } = adminApi;
// // ── Exports ───────────────────────────────────────────────────────────────
// // Add to your adminApi exports:
// // useGetAppointmentsAdvancedFilterQuery, useLookupAppointmentMutation