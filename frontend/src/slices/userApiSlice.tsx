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
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
    }),
  }),
});


export const { useLoginMutation, useLogoutMutation,useRegisterMutation,useProfileMutation 
, useGetUsersQuery,useDeleteUserMutation} = userApiSlice;
export type { LoginRequest, LogoutResponse };