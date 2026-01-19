import React, { useState } from 'react';

interface HamburgerMenuProps {
  onNavigate: (view: 'Main' | 'Reports') => void;
  currentView: 'Main' | 'Reports';
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  onNavigate,
  currentView,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavigate = (view: 'Main' | 'Reports') => {
    onNavigate(view);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
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
        <div className="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black">
          <button
            onClick={() => handleNavigate('Main')}
            className={`block w-full px-4 py-2 text-left text-sm ${
              currentView === 'Main'
                ? 'bg-gray-100 font-bold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Main
          </button>
          <button
            onClick={() => handleNavigate('Reports')}
            className={`block w-full px-4 py-2 text-left text-sm ${
              currentView === 'Reports'
                ? 'bg-gray-100 font-bold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Reports
          </button>
        </div>
      )}
    </div>
  );
};
