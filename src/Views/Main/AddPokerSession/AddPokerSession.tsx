import React from 'react';

import { useEditingSession } from '../../../hooks/useEditingSession';
import { useSessionDetailsSync } from '../../../hooks/useSessionDetailsSync';
import { useSessionForm } from '../../../hooks/useSessionForm';
import type { SessionDetails } from '../types';

import { SessionFormContent } from './SessionFormContent';
import { useCashOutMode } from './useCashOutMode';

interface SessionFormProps {
  currentSessionId: string | null;
  editingSessionId: string | null;
  selectedPlayers: Array<{
    playerId: string;
    name: string;
    description: string;
    amount: string;
    seatNumber: number;
    buyInAmount: number;
  }>;
  onCancelEdit: () => void;
  onDetailsChange: (details: SessionDetails) => void;
  onSeatNumberChange: (playerId: string, seatNumber: number) => void;
  onSubmit: (
    details: SessionDetails,
    cashOutValues: Record<string, number>,
  ) => void;
}

export const AddPokerSession: React.FC<SessionFormProps> = ({
  currentSessionId,
  editingSessionId,
  selectedPlayers,
  onCancelEdit,
  onDetailsChange,
  onSeatNumberChange,
  onSubmit,
}) => {
  const editingSession = useEditingSession(editingSessionId);
  const {
    isCashOutMode,
    cashOutValues,
    handleCashOutClick,
    handleCashOutChange,
  } = useCashOutMode(currentSessionId, editingSessionId);

  const {
    date,
    location,
    game,
    stakes,
    setDate,
    setLocation,
    setGame,
    setStakes,
  } = useSessionForm({
    initialDate: editingSession?.date,
    initialLocation: editingSession?.location,
    initialGame: editingSession?.game,
    initialStakes: editingSession?.stakes,
  });

  useSessionDetailsSync(date, location, game, stakes, onDetailsChange);

  const isEditing = editingSessionId !== null;

  const onCashOutButtonClick = () => {
    handleCashOutClick(selectedPlayers);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const details = {
      date,
      location: location.trim(),
      game: game.trim(),
      stakes: stakes.trim(),
    };
    onSubmit(details, cashOutValues);
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        {isEditing ? 'Edit Poker Session' : 'Add Poker Session'}
      </h2>
      <form
        key={editingSessionId ?? 'new'}
        onSubmit={handleFormSubmit}
        className="space-y-4"
      >
        <SessionFormContent
          date={date}
          location={location}
          game={game}
          stakes={stakes}
          selectedPlayers={selectedPlayers}
          sessionId={editingSessionId ?? currentSessionId}
          isEditing={isEditing}
          isCashOutMode={isCashOutMode}
          cashOutValues={cashOutValues}
          onDateChange={setDate}
          onLocationChange={setLocation}
          onGameChange={setGame}
          onStakesChange={setStakes}
          onSeatNumberChange={onSeatNumberChange}
          onCashOutChange={handleCashOutChange}
          onCashOutClick={onCashOutButtonClick}
          onCancelEdit={onCancelEdit}
        />
      </form>
    </div>
  );
};
