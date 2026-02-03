import { useFirebaseAuth } from '@hooks/useFirebaseAuth';
import type { User } from 'firebase/auth';
import React, { useState } from 'react';

import {
  signInWithGoogle,
  signOutFromFirebase,
} from '../../utils/firebaseAuth';

interface MenuDropdownProps {
  user: User | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({
  user,
  onSignIn,
  onSignOut,
}) => (
  <div className="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black">
    <button
      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
      onClick={() => alert('Home clicked')}
    >
      Home
    </button>
    <div className="my-1 border-t border-gray-100" />
    {user ? (
      <button
        onClick={onSignOut}
        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
      >
        Sign out
      </button>
    ) : (
      <button
        onClick={onSignIn}
        className="block w-full px-4 py-2 text-left text-sm text-indigo-600 hover:bg-gray-50"
      >
        Sign in with Google
      </button>
    )}
  </div>
);

export const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useFirebaseAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to sign in', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutFromFirebase();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="Menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <MenuDropdown
          user={user}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  );
};
