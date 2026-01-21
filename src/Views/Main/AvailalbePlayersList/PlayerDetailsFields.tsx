import React from 'react';

interface PlayerDetailsFieldsProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const PlayerDetailsFields: React.FC<PlayerDetailsFieldsProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}) => (
  <div className="grid gap-3 md:grid-cols-2">
    <div className="space-y-1">
      <label
        htmlFor="player-name"
        className="text-sm font-medium text-gray-700"
      >
        Player name
      </label>
      <input
        id="player-name"
        type="text"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
    <div className="space-y-1">
      <label
        htmlFor="player-description"
        className="text-sm font-medium text-gray-700"
      >
        Description
      </label>
      <input
        id="player-description"
        type="text"
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  </div>
);
