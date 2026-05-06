import { baseApi } from '@/redux/baseApi';

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /services/all
    getServices: builder.query({
      query: () => '/services/all',
    }),

    // GET /services/:service_id
    getServiceById: builder.query({
      query: (serviceId: string | number) => `/services/${serviceId}`,
    }),

  }),
  overrideExisting: true,
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
} = servicesApi;