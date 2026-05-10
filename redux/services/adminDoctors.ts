// redux/services/adminDoctors.ts
import { baseApi } from '@/redux/baseApi';

export interface Doctor {
    id: string;
    name: string | null;
    full_name: string;
    designation: string;
    specialization: string | null;
    tier: number | null;
    active: boolean | null;
    consultation_days: string | null;
    consultation_time: string;
    about: string | null;
    specialties: string | null;
    avatar_url: string;
    yezza_provider_id: number | null;
    yezza_service_id: number;
    doctor_phone: number | null;
}

export interface GetAllDoctorsResponse {
    count: number;
    results: Doctor[];
}

export interface GetSingleDoctorResponse {
    data: Doctor;
}

export type UpdateDoctorBody = {
    name?: string | null;
    full_name?: string;
    designation?: string;
    specialization?: string | null;
    tier?: number | null;
    active?: boolean | null;
    consultation_days?: string[] | null;
    consultation_time?: string;
    about?: string | null;
    specialties?: string | null;
    avatar_url?: string;
    yezza_provider_id?: number | null;
    yezza_service_id?: number;
    doctor_phone?: string | null;
}

export const adminDoctorsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllDoctors: builder.query<GetAllDoctorsResponse, void>({
            query: () => ({ url: '/admin/doctors', method: 'GET' }),
            providesTags: ['Doctors'],
            keepUnusedDataFor: 0,
        }),

        getDoctorById: builder.query<GetSingleDoctorResponse, string>({
            query: (doctorId) => ({ url: `/doctors/doctors/${doctorId}`, method: 'GET' }),
            providesTags: (result, error, id) => [{ type: 'Doctors' as const, id }],
        }),

        addDoctor: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: '/admin/doctors',
                method: 'POST',
                body: formData,
                formData: true,
            }),
            invalidatesTags: ['Doctors'],
        }),

        // PATCH — sends FormData so avatar_file can be included alongside JSON fields
        updateDoctorProfile: builder.mutation<any, { doctorId: string; formData: any }>({
            query: ({ doctorId, formData }) => ({
                url: `/admin/doctors/${doctorId}`,
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: (result, error, { doctorId }) => [
                'Doctors',
                { type: 'Doctors' as const, id: doctorId },
            ],
        }),

        deleteDoctor: builder.mutation<any, string>({
            query: (doctorId) => ({
                url: `/admin/doctors/${doctorId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Doctors'],
        }),

    }),
    overrideExisting: true,
});

export const {
    useGetAllDoctorsQuery,
    useGetDoctorByIdQuery,
    useAddDoctorMutation,
    useUpdateDoctorProfileMutation,
    useDeleteDoctorMutation,
} = adminDoctorsApi;