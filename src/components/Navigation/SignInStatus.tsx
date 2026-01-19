import React from 'react';

import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';

export const SignInStatus: React.FC = () => {
  const { user, initializing, content } = useFirebaseAuth();

  return (
    <div className="mr-2 flex flex-col items-end">
      <span
        className={`text-xs ${
          initializing
            ? 'text-gray-500 italic'
            : !user
              ? 'text-gray-400'
              : 'font-medium text-gray-700'
        }`}
      >
        {content}
      </span>
      {!initializing && user?.email && user?.displayName && (
        <span className="text-[10px] leading-tight text-gray-500">
          {user.email}
        </span>
      )}
    </div>
  );
};
