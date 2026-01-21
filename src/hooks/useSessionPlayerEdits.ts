import type { Dispatch, SetStateAction } from 'react';

import { useAppDispatch } from '../store/hooks';
import { addBuyInToResult } from '../store/slices/resultsSlice';
import type { SessionPlayerSelection } from '../Views/Main/types';

interface UseSessionPlayerEditsConfig {
  sessionId: string | null;
  setSelectedPlayers: Dispatch<SetStateAction<SessionPlayerSelection[]>>;
}

interface UseSessionPlayerEditsResult {
  handleAmountChange: (playerId: string, amount: string) => void;
  handleRemoveSelected: (playerId: string) => void;
  handleSeatNumberChange: (playerId: string, seatNumber: number) => void;
  handleRebuy: (playerId: string, buyInAmount: number) => void;
}

export const useSessionPlayerEdits = (
  config: UseSessionPlayerEditsConfig,
): UseSessionPlayerEditsResult => {
  const { sessionId, setSelectedPlayers } = config;
  const dispatch = useAppDispatch();

  const handleRebuy = (playerId: string, buyInAmount: number) => {
    if (!sessionId) return;
    dispatch(
      addBuyInToResult({
        playerId,
        sessionId,
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

  return {
    handleAmountChange,
    handleRebuy,
    handleRemoveSelected,
    handleSeatNumberChange,
  };
};
