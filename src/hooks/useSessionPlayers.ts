import type { Player } from '@store/slices/playersSlice';
import type { Dispatch, SetStateAction } from 'react';

import type {
  SessionDetails,
  SessionPlayerSelection,
} from '../Views/Main/types';

import { useAddToSessionHandler } from './useAddToSessionHandler';
import { useSelectedPlayersState } from './useSelectedPlayersState';
import { useSessionPlayerEdits } from './useSessionPlayerEdits';

interface UseSessionPlayersConfig {
  editingSessionId: string | null;
  currentSessionId: string | null;
  onSessionCreated: (sessionId: string) => void;
  getSessionDetails: () => SessionDetails;
}

interface UseSessionPlayersResult {
  selectedPlayers: SessionPlayerSelection[];
  handleAddToSession: (player: Player, buyInAmount: number) => void;
  handleAmountChange: (playerId: string, amount: string) => void;
  handleRemoveSelected: (playerId: string) => void;
  handleSeatNumberChange: (playerId: string, seatNumber: number) => void;
  handleRebuy: (playerId: string, buyInAmount: number) => void;
  setSelectedPlayers: Dispatch<SetStateAction<SessionPlayerSelection[]>>;
  clearSelectedPlayers: () => void;
}

export const useSessionPlayers = (
  config: UseSessionPlayersConfig,
): UseSessionPlayersResult => {
  const {
    editingSessionId,
    currentSessionId,
    getSessionDetails,
    onSessionCreated,
  } = config;
  const { selectedPlayers, setSelectedPlayers, clearSelectedPlayers } =
    useSelectedPlayersState({
      currentSessionId,
      editingSessionId,
    });
  const sessionId = editingSessionId ?? currentSessionId;
  const { handleAddToSession } = useAddToSessionHandler({
    getSessionDetails,
    onSessionCreated,
    sessionId,
    setSelectedPlayers,
  });
  const {
    handleAmountChange,
    handleRebuy,
    handleRemoveSelected,
    handleSeatNumberChange,
  } = useSessionPlayerEdits({
    sessionId,
    setSelectedPlayers,
  });

  return {
    clearSelectedPlayers,
    handleAddToSession,
    handleAmountChange,
    handleRebuy,
    handleRemoveSelected,
    handleSeatNumberChange,
    selectedPlayers,
    setSelectedPlayers,
  };
};
