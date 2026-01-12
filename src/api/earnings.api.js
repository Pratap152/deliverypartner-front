import { createApi } from '@reduxjs/toolkit/query/react';
import { EarningsClient } from '../services/ApiClient';

export const earningsApi = createApi({
  reducerPath: 'earningsApi',
  baseQuery: EarningsClient,
  endpoints: b => ({
    getMonth: b.query({
      query: m => `/api/earnings/${m}`,
    }),
    getWeek: b.query({
      query: ({ start, end }) =>
        `/api/earnings/week?start=${start}&end=${end}`,
    }),
    getDay: b.query({
      query: d => `/api/earnings/${d}`,
    }),
    getOrder: b.query({
      query: id => `/api/earnings/orders/${id}`,
    }),
  }),
});

export const {
  useGetMonthQuery,
  useGetWeekQuery,
  useGetDayQuery,
  useGetOrderQuery,
} = earningsApi;
