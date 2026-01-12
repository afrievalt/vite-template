import React from 'react';

interface PlayersFormProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAdd: () => void;
}

export const PlayersForm: React.FC<PlayersFormProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onAdd,
}) => (
  <div className="space-y-3">
    <div className="grid gap-3 md:grid-cols-2">
      <input
        type="text"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder="Player name"
        className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <input
        type="text"
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder="Description"
        className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
    <button
      type="button"
      onClick={onAdd}
      className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-900 focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:outline-none"
    >
      Add player
    </button>
  </div>
);
