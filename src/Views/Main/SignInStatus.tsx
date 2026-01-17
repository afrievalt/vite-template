import React from 'react';

import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import {
  signInWithGoogle,
  signOutFromFirebase,
} from '../../utils/firebaseAuth';

const buttonBaseClass =
  'rounded-full border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400';

const handleSignIn = () =>
  signInWithGoogle().catch((error) => {
    console.error('Failed to sign in', error);
  });

const handleSignOut = () =>
  signOutFromFirebase().catch((error) => {
    console.error('Failed to sign out', error);
  });

export const SignInStatus: React.FC = () => {
  const { user, initializing } = useFirebaseAuth();

  const userLabel = user?.displayName ?? user?.email ?? 'Authenticated user';

  return (
    <div className="flex h-full flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
      {initializing ? (
        <p className="text-sm text-gray-500">Checking authentication…</p>
      ) : user ? (
        <>
          <div>
            <p className="text-sm font-semibold text-gray-900">{userLabel}</p>
            {user.email && (
              <p className="text-xs text-gray-500">{user.email}</p>
            )}
          </div>
          <button
            type="button"
            className={buttonBaseClass}
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Sign in to keep your sessions synced with Firebase.
          </p>
          <button
            type="button"
            className={buttonBaseClass}
            onClick={handleSignIn}
          >
            Sign in with Google
          </button>
        </>
      )}
    </div>
  );
};
