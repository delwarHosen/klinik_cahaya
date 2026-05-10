// redux/services/faqChatApi.ts
import { baseApi } from '@/redux/baseApi';

export interface FaqChatResponse {
    reply: string;
    title: string | null;
    topic: string | null;
    confidence: number | null;
    source: string;
}

export const faqChatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendFaqMessage: builder.mutation<FaqChatResponse, { message: string }>({
            query: (body) => ({
                url: '/faq/faq_chat',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useSendFaqMessageMutation } = faqChatApi;