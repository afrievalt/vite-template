import React, { useCallback, useState } from 'react';

import { useSessionPlayers } from '../../hooks/useSessionPlayers';
import { useSessionSubmit } from '../../hooks/useSessionSubmit';

import { AddPokerSession } from './AddPokerSession/AddPokerSession';
import { PlayersSection } from './AvailalbePlayersList/PlayersSection';
import { SessionsList } from './Results/SessionsList';
import type { SessionDetails } from './types';

export const Main: React.FC = () => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails>({
    date: new Date().toISOString().slice(0, 10),
    location: 'Bobs House',
    game: 'Big O',
    stakes: '4-8 Kill',
  });

  const getSessionDetails = useCallback(() => sessionDetails, [sessionDetails]);

  const {
    selectedPlayers,
    handleAddToSession,
    handleSeatNumberChange,
    clearSelectedPlayers,
  } = useSessionPlayers({
    editingSessionId,
    currentSessionId,
    onSessionCreated: (sessionId) => {
      setCurrentSessionId(sessionId);
    },
    getSessionDetails,
  });

  const { handleSubmit: handleSessionSubmit } = useSessionSubmit();

  const handleEditSession = (sessionId: string) => {
    setEditingSessionId(sessionId);
    setCurrentSessionId(null);
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setCurrentSessionId(null);
    clearSelectedPlayers();
  };

  const handleSubmit = (
    details: SessionDetails,
    cashOutValues: Record<string, number>,
  ) => {
    setSessionDetails(details);
    const sessionId = editingSessionId ?? currentSessionId;
    handleSessionSubmit(
      details,
      selectedPlayers,
      sessionId,
      cashOutValues,
      () => {
        setEditingSessionId(null);
        setCurrentSessionId(null);
        clearSelectedPlayers();
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-2xl px-4">
        <AddPokerSession
          currentSessionId={currentSessionId}
          editingSessionId={editingSessionId}
          selectedPlayers={selectedPlayers}
          onCancelEdit={handleCancelEdit}
          onDetailsChange={setSessionDetails}
          onSeatNumberChange={handleSeatNumberChange}
          onSubmit={handleSubmit}
        />
        <PlayersSection
          onAddToSession={handleAddToSession}
          selectedPlayerIds={selectedPlayers.map((player) => player.playerId)}
        />
        <SessionsList onEditSession={handleEditSession} />
      </div>
    </div>
  );
};

export default Main;
