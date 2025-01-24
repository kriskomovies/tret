import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { appStateSlice } from './features/app-state-slice';
import { authService } from './services/auth.service';
import storage from 'redux-persist/lib/storage';
import { usersService } from './services/users.service';
import { walletsService } from './services/wallets.service';

const rootReducer = combineReducers({
  // slices
  [appStateSlice.name]: appStateSlice.reducer,
  // services
  [authService.reducerPath]: authService.reducer,
  [usersService.reducerPath]: usersService.reducer,
  [walletsService.reducerPath]: walletsService.reducer,
});


const persistConfig = (reducersToPersist: string[]) => ({
  key: 'root',
  storage,
  whitelist: reducersToPersist,
});

const persistRootReducer = persistReducer(
  persistConfig([appStateSlice.name]),
  rootReducer,
);

export const store = configureStore({
  reducer: persistRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authService.middleware,
      usersService.middleware,
      walletsService.middleware,
    ]),
});

const persistor = persistStore(store);

export { persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 