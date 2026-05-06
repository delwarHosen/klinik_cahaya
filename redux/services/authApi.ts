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

    // Sign up
    signup: builder.mutation({
      query: (data) => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
      }),
    }),

    // Onboarding — Profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/auth/onboarding/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Onboarding — Medical
    updateMedical: builder.mutation({
      query: (data) => ({
        url: '/auth/onboarding/medical',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Onboarding — Insurance
    updateInsurance: builder.mutation({
      query: (data) => ({
        url: '/auth/onboarding/insurance',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Onboarding — Family
    updateFamily: builder.mutation({
      query: (data) => ({
        url: '/auth/onboarding/family',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Onboarding — Photo
    uploadPhoto: builder.mutation({
      query: (formData) => ({
        url: '/auth/onboarding/photo',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    // Profile — Update Family (PATCH)
    updateFamilyPatch: builder.mutation({
      query: (data) => ({
        url: '/auth/profile/family',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot_password',
        method: 'POST',
        body: data,
      }),
    }),

    // Reset Password
    // baseQueryWithAuth এ access_token automatically যায়,
    // কিন্তু reset এ আলাদা reset token লাগে তাই manually override করা হচ্ছে
    resetPassword: builder.mutation({
      query: ({ access_token, new_password, confirm_password }) => ({
        url: '/auth/change_password',
        method: 'POST',
        body: { new_password, confirm_password },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }),
    }),

    // Get Profile
    getProfile: builder.query({
      query: () => '/auth/onboarding',
      providesTags: ['Auth'],
      keepUnusedDataFor: 300, // 5 মিনিট cache
    }),

  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
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