import { HamburgerMenu } from '@components/Navigation/HamburgerMenu';
import { SignInStatus } from '@components/Navigation/SignInStatus';
import React from 'react';

import Home from './Views/Home/Home';

export const Application = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="mb-4 bg-white shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <span className="text-xl font-bold text-indigo-600">
            Vite Template
          </span>
          <div className="flex items-center gap-4">
            <SignInStatus />
            <HamburgerMenu />
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-2xl">
        <Home />
      </main>
    </div>
  );
};
