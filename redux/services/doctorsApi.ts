import { baseApi } from '@/redux/baseApi';

export const doctorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /doctors/doctors
    getDoctors: builder.query({
      query: () => '/doctors/doctors',
    }),

    // GET /doctors/doctors/:doctor_id
    getDoctorById: builder.query({
      query: (doctorId: string) => `/doctors/doctors/${doctorId}`,
    }),

  }),
  overrideExisting: true,
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
} = doctorsApi;