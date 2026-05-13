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

       // redux/services/notificationApi.ts

getAdminNotifications: builder.query<NotificationListResponse, void>({
    query: () => ({ url: '/notifications/admin', method: 'GET' }),
    providesTags: ['AdminNotifications'], 
}),

getPatientNotifications: builder.query<NotificationListResponse, void>({
    query: () => ({ url: '/notifications/patient', method: 'GET' }),
    providesTags: ['PatientNotifications'], 
}),

markNotificationRead: builder.mutation<any, { id: string; role: 'admin' | 'patient' }>({
    query: ({ id }) => ({
        url: '/notifications/read',
        method: 'PATCH',
        body: { notification_id: id },
    }),
    async onQueryStarted({ id, role }, { dispatch, queryFulfilled }) {
        
        const queryName = role === 'admin'
            ? 'getAdminNotifications'
            : 'getPatientNotifications';

        const patch = dispatch(
            notificationApi.util.updateQueryData(queryName, undefined, (draft) => {
                const n = draft.results.find((r) => r.id === id);
                if (n) n.is_read = true;
            })
        );
        try {
            await queryFulfilled;
        } catch {
            patch.undo();
        }
    },
}),

deleteNotification: builder.mutation<any, { id: string; role: 'admin' | 'patient' }>({
    query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
    }),
    async onQueryStarted({ id, role }, { dispatch, queryFulfilled }) {
        const queryName = role === 'admin'
            ? 'getAdminNotifications'
            : 'getPatientNotifications';

        const patch = dispatch(
            notificationApi.util.updateQueryData(queryName, undefined, (draft) => {
                draft.results = draft.results.filter((r) => r.id !== id);
                draft.count = Math.max(0, draft.count - 1);
            })
        );
        try {
            await queryFulfilled;
        } catch {
            patch.undo();
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