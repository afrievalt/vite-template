import { configureStore } from '@reduxjs/toolkit';

import { loadPersistedState, persistStore } from './persistence';
import buyinsReducer from './slices/buyinsSlice';
import counterReducer from './slices/counterSlice';
import playersReducer from './slices/playersSlice';
import resultsReducer from './slices/resultsSlice';
import sessionsReducer from './slices/sessionsSlice';

export const store = configureStore({
  reducer: {
    buyIns: buyinsReducer,
    counter: counterReducer,
    players: playersReducer,
    results: resultsReducer,
    sessions: sessionsReducer,
  },
  preloadedState: loadPersistedState(),
});

persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
