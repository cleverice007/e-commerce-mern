import { fetchBaseQuery, createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

const baseQuery: BaseQueryFn<string, unknown, unknown> = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
