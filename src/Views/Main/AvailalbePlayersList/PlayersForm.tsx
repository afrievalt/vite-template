import React from 'react';

import { PlayerDetailsFields } from './PlayerDetailsFields';
import { SkippedSeatsSelector } from './SkippedSeatsSelector';

interface PlayersFormProps {
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAdd: () => void;
  skippedSeats: number[];
  nextSeatNumber: number;
  selectedSeatNumber: number;
  onSkipSeat: () => void;
  onSeatSelect: (seatNumber: number) => void;
}

export const PlayersForm: React.FC<PlayersFormProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onAdd,
  skippedSeats,
  nextSeatNumber,
  selectedSeatNumber,
  onSkipSeat,
  onSeatSelect,
}) => {
  return (
    <div className="space-y-3">
      <PlayerDetailsFields
        name={name}
        description={description}
        onNameChange={onNameChange}
        onDescriptionChange={onDescriptionChange}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAdd}
          className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-900 focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 focus:outline-none"
        >
          Add player
        </button>
        <button
          type="button"
          onClick={onSkipSeat}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
        >
          Skip seat
        </button>
      </div>
      <SkippedSeatsSelector
        skippedSeats={skippedSeats}
        nextSeatNumber={nextSeatNumber}
        selectedSeatNumber={selectedSeatNumber}
        onSeatSelect={onSeatSelect}
      />
    </div>
  );
};
