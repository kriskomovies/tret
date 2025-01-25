import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from './api.utils';

export interface ValidateDepositRequest {
  txId: string;
  network: string;
  userId: number;
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  type: string;
  status: string;
  transaction_id: string;
  network: string;
  from_address: string;
  created_at: string;
  token: string;
}

export const depositsService = createApi({
  reducerPath: 'depositsService',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['Deposits'],
  endpoints: (builder) => ({
    validateDeposit: builder.mutation<{ success: boolean; transaction: Transaction }, ValidateDepositRequest>({
      query: (body) => ({
        url: '/api/deposits/validate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Deposits'],
    }),
    
    getDepositHistory: builder.query<Transaction[], void>({
      query: () => '/api/deposits/history',
      providesTags: ['Deposits'],
    }),
  }),
});

export const {
  useValidateDepositMutation,
  useGetDepositHistoryQuery,
} = depositsService; 