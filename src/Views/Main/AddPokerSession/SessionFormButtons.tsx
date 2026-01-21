import React from 'react';

import { useSessionFormContext } from './SessionFormContext';

export const SessionFormButtons: React.FC = () => {
  const { isEditing, isCashOutMode, onCancelEdit } = useSessionFormContext();
  if (!isCashOutMode) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {isEditing && (
        <button
          type="button"
          onClick={onCancelEdit}
          className="flex-1 rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
        >
          Cancel
        </button>
      )}
      <button
        type="submit"
        className={`rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
          isEditing ? 'flex-1' : 'w-full'
        }`}
      >
        {isEditing ? 'Update Session' : 'Save Session'}
      </button>
    </div>
  );
};
