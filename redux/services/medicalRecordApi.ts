import { baseApi } from '@/redux/baseApi';

export const medicalRecordsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMedicalRecords: builder.query<any, string>({
            query: (icLast4) => `/medical-records?ic_last4=${icLast4}`,
        }),
    }),
    overrideExisting: true,
});

export const { useLazyGetMedicalRecordsQuery } = medicalRecordsApi;