import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';
import { type } from 'os';


interface LoginRequest {
  email: string;
  password: string;
}
interface LogoutResponse {
  message: string;
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
    logout: builder.mutation<LogoutResponse, void>({  
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});


export const { useLoginMutation, useLogoutMutation,useRegisterMutation } = userApiSlice;
export type { LoginRequest, LogoutResponse };