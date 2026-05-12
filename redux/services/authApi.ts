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

    // Verify OTP (after signup)
    verifyOtp: builder.mutation({
      query: (data: { email: string; otp: string }) => ({
        url: '/auth/signup/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),

    // Resend OTP
    resendOtp: builder.mutation({
      query: (data: { email: string }) => ({
        url: '/auth/signup/resend_otp',
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

    // Forgot Password — send OTP
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot_password',
        method: 'POST',
        body: data,
      }),
    }),

    // Forgot Password — verify OTP (returns access_token)
    verifyForgotPasswordOtp: builder.mutation<any, { email: string; otp: string }>({
      query: (body) => ({
        url: '/auth/forgot_password/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    // Forgot Password — resend OTP
    resendForgotPasswordOtp: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: '/auth/forgot_password',
        method: 'POST',
        body,
      }),
    }),

    // Reset Password — token baseApi AsyncStorage থেকে নেবে (reset_access_token)
    resetPassword: builder.mutation<any, { email: string; new_password: string; confirm_password?: string }>({
      query: ({ email, new_password, confirm_password }) => ({
        url: '/auth/reset_password',
        method: 'POST',
        body: { email, new_password, confirm_password },
        // ✅ headers এখানে নেই — baseApi নিজেই reset_access_token inject করবে
      }),
    }),

    // Change Password
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/change_password',
        method: 'POST',
        body: data,
      }),
    }),

    // Get Profile
    getProfile: builder.query({
      query: () => '/auth/onboarding',
      providesTags: ['Auth'],
      keepUnusedDataFor: 0,
    }),

    // Profile — Update Insurance (PATCH)
    updateInsurancePatch: builder.mutation({
      query: (body) => ({ url: '/auth/profile/insurance', method: 'PATCH', body }),
      invalidatesTags: ['Auth'],
    }),

    // Profile — Update Photo
    updatePhoto: builder.mutation({
      query: (body) => ({ url: '/auth/profile/photo', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),

    // Edit phone
    updatePhone: builder.mutation({
      query: (data) => ({
        url: '/auth/profile/phone',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Profile — Update Medical (PATCH)
    updateMedicalPatch: builder.mutation({
      query: (body) => ({ url: '/auth/profile/medical', method: 'PATCH', body }),
      invalidatesTags: ['Auth'],
    }),

  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
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
  useChangePasswordMutation,
  useUpdateInsurancePatchMutation,
  useUpdatePhotoMutation,
  useUpdatePhoneMutation,
  useUpdateMedicalPatchMutation,
  useVerifyForgotPasswordOtpMutation,
  useResendForgotPasswordOtpMutation,
} = authApi;