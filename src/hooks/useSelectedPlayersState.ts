import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  initializeSeatSkips,
  resetSeatSkips,
} from '../store/slices/seatSkipsSlice';
import type { SessionPlayerSelection } from '../Views/Main/types';

interface UseSelectedPlayersStateConfig {
  editingSessionId: string | null;
  currentSessionId: string | null;
}

interface UseSelectedPlayersStateResult {
  selectedPlayers: SessionPlayerSelection[];
  setSelectedPlayers: Dispatch<SetStateAction<SessionPlayerSelection[]>>;
  clearSelectedPlayers: () => void;
}

export const useSelectedPlayersState = (
  config: UseSelectedPlayersStateConfig,
): UseSelectedPlayersStateResult => {
  const { editingSessionId, currentSessionId } = config;
  const dispatch = useAppDispatch();
  const sessions = useAppSelector((state) => state.sessions.sessions);
  const results = useAppSelector((state) => state.results.results);
  const players = useAppSelector((state) => state.players.players);
  const [selectedPlayers, setSelectedPlayers] = useState<
    SessionPlayerSelection[]
  >([]);

  useEffect(() => {
    if (editingSessionId) {
      const session = sessions.find((s) => s.id === editingSessionId);
      if (!session) {
        return;
      }
      const sessionResults = results.filter(
        (result) => result.sessionId === editingSessionId,
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
      dispatch(
        initializeSeatSkips({
          assignedSeats: playerSelections.map((player) => player.seatNumber),
        }),
      );
      return;
    }
    if (!currentSessionId) {
      setSelectedPlayers([]);
      dispatch(resetSeatSkips());
    }
  }, [
    editingSessionId,
    currentSessionId,
    sessions,
    results,
    players,
    dispatch,
  ]);

  const clearSelectedPlayers = () => {
    setSelectedPlayers([]);
    dispatch(resetSeatSkips());
  };

  return { clearSelectedPlayers, selectedPlayers, setSelectedPlayers };
};
