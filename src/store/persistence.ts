import type { Store } from '@reduxjs/toolkit';

import type { PlayersState } from './slices/playersSlice';
import type { ResultsState } from './slices/resultsSlice';
import type { SessionsState } from './slices/sessionsSlice';

interface PersistenceRoot {
  players: PlayersState;
  sessions: SessionsState;
  results: ResultsState;
  [key: string]: unknown;
}

interface PersistedState {
  players: PlayersState;
  sessions: SessionsState;
  results: ResultsState;
}

const STORAGE_KEY = 'poker-results-state-dev';

const safeParse = (raw: string): PersistedState | undefined => {
  try {
    const parsed = JSON.parse(raw) as PersistedState;
    if (
      parsed &&
      parsed.players?.players &&
      parsed.sessions?.sessions &&
      parsed.results?.results
    ) {
      return parsed;
    }
    return undefined;
  } catch (error) {
    console.warn('Failed to parse persisted state', error);
    return undefined;
  }
};

export const loadPersistedState = (): Partial<PersistedState> | undefined => {
  if (typeof localStorage === 'undefined') {
    return undefined;
  }
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (!savedState) {
    return undefined;
  }
  return safeParse(savedState);
};

export const persistStore = (store: Store<PersistenceRoot>): void => {
  if (typeof localStorage === 'undefined') {
    return;
  }
  const saveState = (): void => {
    const { players, sessions, results } = store.getState();
    const nextState: PersistedState = { players, sessions, results };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  };

  saveState();
  store.subscribe(saveState);
};
