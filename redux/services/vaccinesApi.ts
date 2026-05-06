import { baseApi } from '@/redux/baseApi';

export const vaccinesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVaccineStock: builder.query({
      query: () => '/vaccine/vaccine_stock',
    }),
  }),
  overrideExisting: true,
});

export const { useGetVaccineStockQuery } = vaccinesApi;