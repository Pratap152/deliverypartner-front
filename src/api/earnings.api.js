import { createApi } from '@reduxjs/toolkit/query/react';
import { apiClient } from '../../services/apiClient';

export const earningsApi = createApi({
  reducerPath: 'earningsApi',
  baseQuery: apiClient,
  endpoints: b => ({
    getMonth: b.query({
      query: m => `/earnings/${m}`,
    }),
    getWeek: b.query({
      query: ({ start, end }) =>
        `/earnings/week?start=${start}&end=${end}`,
    }),
    getDay: b.query({
      query: d => `/earnings/${d}`,
    }),
    getOrder: b.query({
      query: id => `/earnings/orders/${id}`,
    }),
  }),
});

export const {
  useGetMonthQuery,
  useGetWeekQuery,
  useGetDayQuery,
  useGetOrderQuery,
} = earningsApi;
