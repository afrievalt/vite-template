import React, { useState } from 'react';

import { HamburgerMenu } from './components/Navigation/HamburgerMenu';
import Main from './Views/Main/Main';
import Reports from './Views/Reports/Reports';

export const Application = () => {
  const [currentView, setCurrentView] = useState<'Main' | 'Reports'>('Main');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="mb-4 bg-white shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <span className="text-xl font-bold text-indigo-600">
            Poker Tracker
          </span>
          <HamburgerMenu
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
          />
        </div>
      </nav>
      {currentView === 'Main' ? <Main /> : <Reports />}
    </div>
  );
};
