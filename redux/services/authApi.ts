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

    // update family info
    updateFamilyPatch: builder.mutation({
      query: (data) => ({
        url: '/auth/profile/family',
        method: 'PATCH',
        body: data,
      }),
    }),

    // forgot password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot_password',
        method: 'POST',
        body: data,
      }),
    }),

    // reset password
    resetPassword: builder.mutation({
      query: ({ access_token, new_password, confirm_password }) => ({
        url: '/auth/change_password',  // ← এটা fix করুন
        method: 'POST',
        body: { new_password, confirm_password },
        headers: {
          Authorization: `Bearer ${access_token}`,  // ← token header এ পাঠান
        },
      }),
    }),


    // Get Profile
    getProfile: builder.query({
      query: () => '/auth/onboarding',
      providesTags: ['Auth'],
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
  useUploadPhotoMutation,
  useUpdateFamilyPatchMutation,
  useGetProfileQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;