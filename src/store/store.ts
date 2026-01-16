import { configureStore } from '@reduxjs/toolkit';
import type { UnknownAction, Reducer } from '@reduxjs/toolkit';

import { loadPersistedState, persistStore } from './persistence';
import buyinsReducer from './slices/buyinsSlice';
import counterReducer from './slices/counterSlice';
import playersReducer from './slices/playersSlice';
import type { PlayersState } from './slices/playersSlice';
import resultsReducer from './slices/resultsSlice';
import type { ResultsState } from './slices/resultsSlice';
import sessionsReducer from './slices/sessionsSlice';
import type { SessionsState } from './slices/sessionsSlice';

export const store = configureStore({
  reducer: {
    buyIns: buyinsReducer,
    counter: counterReducer,
    players: playersReducer as Reducer<
      PlayersState,
      UnknownAction,
      PlayersState | undefined
    >,
    results: resultsReducer as Reducer<
      ResultsState,
      UnknownAction,
      ResultsState | undefined
    >,
    sessions: sessionsReducer as Reducer<
      SessionsState,
      UnknownAction,
      SessionsState | undefined
    >,
  },
  preloadedState: loadPersistedState(),
});

persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
