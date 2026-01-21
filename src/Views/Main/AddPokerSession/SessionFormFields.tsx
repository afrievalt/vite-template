import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { SessionDetails } from '../types';

export const SessionFormFields: React.FC = () => {
  const { register } = useFormContext<SessionDetails>();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label
          htmlFor="date"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          id="date"
          type="date"
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
          {...register('date')}
        />
      </div>
      <div>
        <label
          htmlFor="location"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <input
          id="location"
          type="text"
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
          {...register('location')}
        />
      </div>
      <div>
        <label
          htmlFor="game"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Game
        </label>
        <input
          id="game"
          type="text"
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
          {...register('game')}
        />
      </div>
      <div>
        <label
          htmlFor="stakes"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Stakes
        </label>
        <input
          id="stakes"
          type="text"
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
          {...register('stakes')}
        />
      </div>
    </div>
  );
};
