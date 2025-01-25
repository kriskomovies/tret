import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  username: string;
  email: string;
  balance: number;
  status: string;
  membership: string;
}

export interface IAppState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

const initialState: IAppState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { setLoggedIn, setLoggedOut, updateUser } = appStateSlice.actions;

export default appStateSlice.reducer;
