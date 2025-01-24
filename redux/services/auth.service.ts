import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from './api.utils';

export const authService = createApi({
  reducerPath: 'authService',
  baseQuery: baseQueryWithOnQueryStarted,
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    signIn: builder.mutation<any, any>({
      query: (requestBody) => {
        return {
          url: '/api/auth/login',
          body: requestBody,
          method: 'POST',
        };
      },
    }),
  }),
});

export const { useSignInMutation } = authService;
