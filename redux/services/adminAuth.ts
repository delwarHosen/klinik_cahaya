import { baseApi } from '@/redux/baseApi';

export const adminAuth = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Admin — Change Password
        adminChangePassword: builder.mutation({
            query: (data: {
                old_password: string;
                new_password: string;
                confirm_new_password: string;
            }) => ({
                url: '/admin/change-password',
                method: 'POST',
                body: data,
            }),
        }),

    }),
    overrideExisting: true,
});

export const {
    useAdminChangePasswordMutation,
} = adminAuth;