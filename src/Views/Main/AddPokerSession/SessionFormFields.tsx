/* eslint-disable max-lines-per-function */
import React from 'react';

interface SessionFormFieldsProps {
  date: string;
  location: string;
  game: string;
  stakes: string;
  onDateChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onGameChange: (value: string) => void;
  onStakesChange: (value: string) => void;
}

export const SessionFormFields: React.FC<SessionFormFieldsProps> = ({
  date,
  location,
  game,
  stakes,
  onDateChange,
  onLocationChange,
  onGameChange,
  onStakesChange,
}) => {
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
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
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
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Casino, home game..."
          required
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
          value={game}
          onChange={(event) => onGameChange(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="1/2 NLH, 5/5 PLO..."
          required
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
          value={stakes}
          onChange={(event) => onStakesChange(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="4-8 Kill..."
          required
        />
      </div>
    </div>
  );
};
