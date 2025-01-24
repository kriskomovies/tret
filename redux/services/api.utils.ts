import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setLoggedOut } from '../features/app-state-slice';
import { toast } from '@/hooks/use-toast';

const baseUrl = '/';

const createBaseQuery = fetchBaseQuery({
  baseUrl,
});

export const baseQueryWithOnQueryStarted = async (
  args: any,
  api: any,
  extraOptions: any,
): Promise<any> => {
  try {
    const result = await createBaseQuery(args, api, extraOptions);
    const { error, data, meta } = result;
    const { dispatch } = api;

    if (error) {
      const { status } = error;
      if (status == 401) {
        dispatch(setLoggedOut());
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'Your session has expired. Please log in again.',
        });
      }
    }
    return result;
  } catch (error) {
    console.error('Error during baseQuery execution:', error);
  }
};
