import type { Store } from '@reduxjs/toolkit';

interface PersistedState {
  counter: {
    value: number;
  };
}

const STORAGE_KEY = 'vite-template-state';

const safeParse = (raw: string): PersistedState | undefined => {
  try {
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed && typeof parsed.counter?.value === 'number') {
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

export const persistStore = (store: Store): void => {
  if (typeof localStorage === 'undefined') {
    return;
  }
  const saveState = (): void => {
    const state = store.getState() as PersistedState;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  saveState();
  store.subscribe(saveState);
};
