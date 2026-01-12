import React from 'react';

import { useEditingSession } from '../../hooks/useEditingSession';
import { useSessionForm } from '../../hooks/useSessionForm';

import { SelectedPlayersTable } from './SelectedPlayersTable';
import { SessionFormButtons } from './SessionFormButtons';
import { SessionFormFields } from './SessionFormFields';
import type { SessionDetails, SessionPlayerSelection } from './types';

interface SessionFormProps {
  editingSessionId: string | null;
  selectedPlayers: SessionPlayerSelection[];
  onAmountChange: (playerId: string, amount: string) => void;
  onCancelEdit: () => void;
  onDetailsChange: (details: SessionDetails) => void;
  onRemoveSelected: (playerId: string) => void;
  onRebuy: (playerId: string, buyInAmount: number) => void;
  onSeatNumberChange: (playerId: string, seatNumber: number) => void;
  onSubmit: (details: SessionDetails) => void;
}

export const SessionForm: React.FC<SessionFormProps> = ({
  editingSessionId,
  selectedPlayers,
  onAmountChange,
  onCancelEdit,
  onDetailsChange,
  onRemoveSelected,
  onRebuy,
  onSeatNumberChange,
  onSubmit,
}) => {
  const editingSession = useEditingSession(editingSessionId);

  const {
    date,
    location,
    game,
    stakes,
    setDate,
    setLocation,
    setGame,
    setStakes,
    handleSubmit,
  } = useSessionForm({
    initialDate: editingSession?.date,
    initialLocation: editingSession?.location,
    initialGame: editingSession?.game,
    initialStakes: editingSession?.stakes,
  });

  React.useEffect(() => {
    onDetailsChange({ date, location, game, stakes });
  }, [date, location, game, stakes, onDetailsChange]);

  const isEditing = editingSessionId !== null;

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        {isEditing ? 'Edit Poker Session' : 'Add Poker Session'}
      </h2>
      <form
        key={editingSessionId ?? 'new'}
        onSubmit={(event) => handleSubmit(event, onSubmit)}
        className="space-y-4"
      >
        <SessionFormFields
          date={date}
          game={game}
          location={location}
          stakes={stakes}
          onDateChange={setDate}
          onGameChange={setGame}
          onLocationChange={setLocation}
          onStakesChange={setStakes}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Session Players
            </h3>
            <span className="text-sm text-gray-500">
              {selectedPlayers.length} selected
            </span>
          </div>
          <SelectedPlayersTable
            players={selectedPlayers}
            onAmountChange={onAmountChange}
            onRebuy={onRebuy}
            onSeatNumberChange={onSeatNumberChange}
            onRemove={onRemoveSelected}
          />
        </div>

        <SessionFormButtons isEditing={isEditing} onCancel={onCancelEdit} />
      </form>
    </div>
  );
};
