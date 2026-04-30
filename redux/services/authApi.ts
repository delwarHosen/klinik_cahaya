import { baseApi } from '@/redux/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Login
    login: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),

    // sign up
    signup: builder.mutation({
      query: (data) => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
      }),
    }),

    // onboarding start
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/onboarding/profile",
        method: "PUT",
        body: data
      })
    }),

    // Medical Information
    updateMedical: builder.mutation({
      query: (data) => ({
        url: '/auth/onboarding/medical',
        method: 'PUT',
        body: data,
      }),
    }),

    // Insurance Information
    updateInsurance: builder.mutation({
      query: (data) => ({
        url: '/auth/onboarding/insurance',
        method: 'PUT',
        body: data,
      }),
    }),

    // Family Information
    updateFamily: builder.mutation({
      query: (data) => ({
        url: '/auth/onboarding/family',
        method: 'PUT',
        body: data,
      }),
    }),

    // Photo Upload
    uploadPhoto: builder.mutation({
      query: (formData) => ({
        url: '/auth/onboarding/photo',
        method: 'POST',
        body: formData,
      }),
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useUpdateMedicalMutation,
  useUpdateInsuranceMutation,
  useUpdateFamilyMutation,
  useUploadPhotoMutation, } = authApi;