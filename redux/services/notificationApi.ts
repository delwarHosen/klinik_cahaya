// redux/services/notificationApi.ts
import { baseApi } from '@/redux/baseApi';

export interface Notification {
    id: string;
    target_role: string;
    user_phone: string;
    title: string;
    body: string;
    type: string;
    reference_id: string;
    route: string;
    is_read: boolean;
    deleted: boolean;
    created_at: string;
    read_at: string | null;
    appointment_id: string | null;
}

export interface NotificationListResponse {
    count: number;
    results: Notification[];
}

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET admin notifications
        getAdminNotifications: builder.query<NotificationListResponse, void>({
            query: () => ({ url: '/notifications/admin', method: 'GET' }),
            providesTags: ['Notifications'],
        }),

        // GET patient notifications
        getPatientNotifications: builder.query<NotificationListResponse, void>({
            query: () => ({ url: '/notifications/patient', method: 'GET' }),
            providesTags: ['Notifications'],
        }),

        // PATCH mark as read
        markNotificationRead: builder.mutation<any, string>({
            query: (notification_id) => ({
                url: '/notifications/read',
                method: 'PATCH',
                body: { notification_id },
            }),
            // Optimistic update — flip is_read without full refetch
            async onQueryStarted(notification_id, { dispatch, queryFulfilled }) {
                const patchAdmin = dispatch(
                    notificationApi.util.updateQueryData('getAdminNotifications', undefined, (draft) => {
                        const n = draft.results.find((r) => r.id === notification_id);
                        if (n) n.is_read = true;
                    })
                );
                const patchPatient = dispatch(
                    notificationApi.util.updateQueryData('getPatientNotifications', undefined, (draft) => {
                        const n = draft.results.find((r) => r.id === notification_id);
                        if (n) n.is_read = true;
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchAdmin.undo();
                    patchPatient.undo();
                }
            },
        }),

        // DELETE notification
        deleteNotification: builder.mutation<any, string>({
            query: (notification_id) => ({
                url: `/notifications/${notification_id}`,
                method: 'DELETE',
            }),
            // Optimistic update — remove from list instantly
            async onQueryStarted(notification_id, { dispatch, queryFulfilled }) {
                const patchAdmin = dispatch(
                    notificationApi.util.updateQueryData('getAdminNotifications', undefined, (draft) => {
                        draft.results = draft.results.filter((r) => r.id !== notification_id);
                        draft.count = Math.max(0, draft.count - 1);
                    })
                );
                const patchPatient = dispatch(
                    notificationApi.util.updateQueryData('getPatientNotifications', undefined, (draft) => {
                        draft.results = draft.results.filter((r) => r.id !== notification_id);
                        draft.count = Math.max(0, draft.count - 1);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchAdmin.undo();
                    patchPatient.undo();
                }
            },
        }),

    }),
    overrideExisting: true,
});

export const {
    useGetAdminNotificationsQuery,
    useGetPatientNotificationsQuery,
    useMarkNotificationReadMutation,
    useDeleteNotificationMutation,
} = notificationApi;