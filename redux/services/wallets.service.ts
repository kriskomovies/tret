import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithOnQueryStarted } from './api.utils';

export interface Wallet {
  id: number;
  network: string;
  public_key: string;
  private_key: string;
  balance: number;
}

export const walletsService = createApi({
  reducerPath: 'walletsService',
  baseQuery: baseQueryWithOnQueryStarted,
  tagTypes: ['Wallets'],
  endpoints: (builder) => ({
    getUserWallets: builder.query<Wallet[], number>({
      query: (userId) => ({
        url: `/api/wallets?userId=${userId}`,
        method: 'GET',
      }),
      providesTags: ['Wallets'],
    }),
  }),
});

export const { useGetUserWalletsQuery } = walletsService; 