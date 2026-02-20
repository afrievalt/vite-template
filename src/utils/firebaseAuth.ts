import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { app } from './firebase-init';

export const auth = app && getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<void> => {
  await signInWithPopup(auth, googleProvider);
};

export const signOutFromFirebase = async (): Promise<void> => {
  await signOut(auth);
};
