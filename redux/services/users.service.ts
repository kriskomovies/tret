import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from './api.utils';

export const usersService = createApi({
  reducerPath: 'usersService',
  baseQuery: baseQueryWithOnQueryStarted,
  keepUnusedDataFor: 0,
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<any, any>({
      query: ({ page = 0, limit = 10, filters = {} }) => {
        return {
          url: '/users',
          params: { page, limit, filters: JSON.stringify(filters) }, // pass the page and limit as parameters
        };
      },
    }),
    getUserById: builder.query<any, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/user`,
          params: { id },
        };
      },
      providesTags: ['Users'],
    }),
    generate: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: '/generate',
          body: requestBody,
          method: 'POST',
        };
      },
      invalidatesTags: ['Users'],
    }),
    registerUser: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: '/api/auth/register',
          body: requestBody,
          method: 'POST',
        };
      },
    }),
    getUserMembers: builder.query<any, any>({
      query: ({ id }) => {
        return {
          url: '/members',
          params: { id },
        };
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useRegisterUserMutation,
  useGenerateMutation,
  useGetUserMembersQuery,
} = usersService;
