import { getDatabase, ref, set, get } from 'firebase/database';
import type { Database } from 'firebase/database';

import type { RootState } from '../store/store';

import { app } from './firebase-init';
import { auth } from './firebaseAuth';

const STORE_STATE_PATH = 'store-sync/current';

let cachedDatabase: Database | null = null;

const getDatabaseInstance = (): Database | null => {
  if (cachedDatabase) {
    return cachedDatabase;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  cachedDatabase = getDatabase(app);
  return cachedDatabase;
};

const sanitizeStateForFirebase = (state: RootState): RootState => {
  return JSON.parse(JSON.stringify(state));
};

export const syncStoreWithFirebase = async (
  state: RootState,
): Promise<void> => {
  if (!auth.currentUser) {
    return;
  }
  const database = getDatabaseInstance();
  if (!database) {
    return;
  }

  await set(ref(database, STORE_STATE_PATH), {
    state: sanitizeStateForFirebase(state),
    lastSyncedAt: new Date().toISOString(),
  });
};

export const fetchStoreFromFirebase = async (): Promise<RootState | null> => {
  if (!auth.currentUser) {
    return null;
  }
  const database = getDatabaseInstance();
  if (!database) {
    return null;
  }

  const snapshot = await get(ref(database, STORE_STATE_PATH));
  if (snapshot.exists()) {
    const data = snapshot.val();
    return data.state as RootState;
  }
  return null;
};
