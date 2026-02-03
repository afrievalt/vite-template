import { configureStore } from '@reduxjs/toolkit';

import { loadPersistedState, persistStore } from './persistence';
import counterReducer from './slices/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  preloadedState: loadPersistedState(),
});

persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
