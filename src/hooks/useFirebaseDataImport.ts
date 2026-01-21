import { importStore } from '@store/slices/sessionsSlice';
import type { RootState } from '@store/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchStoreFromFirebase } from '../utils/firebaseSync';

import { useFirebaseAuth } from './useFirebaseAuth';

export const useFirebaseDataImport = () => {
  const { user, initializing } = useFirebaseAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!initializing && user) {
      const loadData = async () => {
        try {
          const state = await fetchStoreFromFirebase();
          if (state) {
            dispatch(
              importStore({
                state: state as unknown as RootState & {
                  results: { results: unknown[] };
                  players: { players: unknown[] };
                  counter: { value: number };
                },
                isFullStore: true,
              }),
            );
          }
        } catch (error) {
          console.error('Failed to fetch data from Firebase:', error);
        }
      };
      void loadData();
    }
  }, [user, initializing, dispatch]);

  return { user, initializing };
};
