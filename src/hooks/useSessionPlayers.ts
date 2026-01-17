/* eslint-disable max-lines-per-function */
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Player } from '../store/slices/playersSlice';
import { addBuyInToResult } from '../store/slices/resultsSlice';
import { addSession } from '../store/slices/sessionsSlice';
import { generateUUID } from '../utils/uuid';
import type {
  SessionDetails,
  SessionPlayerSelection,
} from '../Views/Main/types';

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
  setSelectedPlayers: (players: SessionPlayerSelection[]) => void;
  clearSelectedPlayers: () => void;
}

export const useSessionPlayers = (
  config: UseSessionPlayersConfig,
): UseSessionPlayersResult => {
  const {
    editingSessionId,
    currentSessionId,
    onSessionCreated,
    getSessionDetails,
  } = config;
  const dispatch = useAppDispatch();
  const sessions = useAppSelector((state) => state.sessions.sessions);
  const results = useAppSelector((state) => state.results.results);
  const players = useAppSelector((state) => state.players.players);
  const [selectedPlayers, setSelectedPlayers] = useState<
    SessionPlayerSelection[]
  >([]);

  const sessionId = editingSessionId ?? currentSessionId;

  useEffect(() => {
    if (editingSessionId) {
      const session = sessions.find((s) => s.id === editingSessionId);
      if (session) {
        const sessionResults = results.filter(
          (r) => r.sessionId === editingSessionId,
        );
        const playerSelections: SessionPlayerSelection[] = sessionResults.map(
          (result) => {
            const player = players.find((p) => p.id === result.playerId);
            return {
              playerId: result.playerId,
              name: player?.name ?? 'Unknown',
              description: player?.description ?? '',
              amount: result.result?.toString() ?? '',
              seatNumber: result.seatNumber,
              buyInAmount: 97,
            };
          },
        );
        setSelectedPlayers(playerSelections);
      }
    } else if (!currentSessionId) {
      setSelectedPlayers([]);
    }
  }, [editingSessionId, currentSessionId, sessions, results, players]);

  const handleAddToSession = (player: Player, buyInAmount: number) => {
    let targetSessionId = sessionId;

    if (!targetSessionId) {
      const details = getSessionDetails();
      targetSessionId = generateUUID();
      dispatch(
        addSession({
          id: targetSessionId,
          date: details.date,
          location: details.location,
          game: details.game,
          stakes: details.stakes,
        }),
      );
      onSessionCreated(targetSessionId);
    }
    const nextSeatNumber = selectedPlayers.length + 1;
    dispatch(
      addBuyInToResult({
        playerId: player.id,
        sessionId: targetSessionId,
        amount: buyInAmount,
        seatNumber: nextSeatNumber,
      }),
    );

    setSelectedPlayers((prev) => {
      const newSelection: SessionPlayerSelection = {
        playerId: player.id,
        name: player.name,
        description: player.description,
        amount: '',
        seatNumber: nextSeatNumber,
        buyInAmount,
      };

      return [...prev, newSelection];
    });
  };

  const handleRebuy = (playerId: string, buyInAmount: number) => {
    const targetSessionId = sessionId;
    if (!targetSessionId) return;

    dispatch(
      addBuyInToResult({
        playerId,
        sessionId: targetSessionId,
        amount: buyInAmount,
      }),
    );
  };

  const handleAmountChange = (playerId: string, amount: string) => {
    setSelectedPlayers((prev) =>
      prev.map((player) =>
        player.playerId === playerId ? { ...player, amount } : player,
      ),
    );
  };

  const handleRemoveSelected = (playerId: string) => {
    setSelectedPlayers((prev) =>
      prev.filter((player) => player.playerId !== playerId),
    );
  };

  const handleSeatNumberChange = (playerId: string, seatNumber: number) => {
    setSelectedPlayers((prev) =>
      prev.map((player) =>
        player.playerId === playerId ? { ...player, seatNumber } : player,
      ),
    );
  };

  const clearSelectedPlayers = () => {
    setSelectedPlayers([]);
  };

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
