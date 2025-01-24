import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IAppState {
  title: string;
  selectedBuildingId: string;
  isLoggedIn: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    solWalletPublicKey: string;
    tronBase58PublicKey: string;
  };
}

const initialState: IAppState = {
  title: '',
  selectedBuildingId: '',
  isLoggedIn: false,
  user: {} as any,
};

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setLoggedIn(state, action: PayloadAction<any>) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    setLoggedOut(state, action: PayloadAction<void>) {
      state.isLoggedIn = false;
      state.user = {} as any;
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
  },
});

export const {
  setLoggedIn,
  setLoggedOut,
  setUser,
} = appStateSlice.actions;

export default appStateSlice.reducer;
