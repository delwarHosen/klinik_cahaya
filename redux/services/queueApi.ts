import { baseApi } from '@/redux/baseApi';

export const queueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQueue: builder.query({
      query: () => '/queue',
    }),
  }),
  overrideExisting: true,
});

export const { useGetQueueQuery } = queueApi;