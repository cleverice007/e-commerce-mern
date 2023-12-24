import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';


interface LoginRequest {
    username: string;
    password: string;
  }
  
  export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      login: builder.mutation<unknown, LoginRequest>({
        query: (data) => ({
          url: `${USERS_URL}/auth`,
          method: 'POST',
          body: data,
        }),
      }),
    }),
  });
  
  export const { useLoginMutation } = userApiSlice;