import { useAppDispatch, useAppSelector } from '@store/hooks';
import type { Player } from '@store/slices/playersSlice';
import { addBuyInToResult } from '@store/slices/resultsSlice';
import { consumeSelectedSeat } from '@store/slices/seatSkipsSlice';
import { addSession } from '@store/slices/sessionsSlice';
import type { Dispatch, SetStateAction } from 'react';

import { generateUUID } from '../utils/uuid';
import type {
  SessionDetails,
  SessionPlayerSelection,
} from '../Views/Main/types';

interface UseAddToSessionHandlerConfig {
  sessionId: string | null;
  getSessionDetails: () => SessionDetails;
  onSessionCreated: (sessionId: string) => void;
  setSelectedPlayers: Dispatch<SetStateAction<SessionPlayerSelection[]>>;
}

interface UseAddToSessionHandlerResult {
  handleAddToSession: (player: Player, buyInAmount: number) => void;
}

export const useAddToSessionHandler = (
  config: UseAddToSessionHandlerConfig,
): UseAddToSessionHandlerResult => {
  const { sessionId, getSessionDetails, onSessionCreated, setSelectedPlayers } =
    config;
  const dispatch = useAppDispatch();
  const seatSkips = useAppSelector((state) => state.seatSkips);

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
    const seatNumber = seatSkips.selectedSeatNumber || seatSkips.nextSeatNumber;
    dispatch(
      addBuyInToResult({
        playerId: player.id,
        sessionId: targetSessionId,
        amount: buyInAmount,
        seatNumber,
      }),
    );
    setSelectedPlayers((prev) => [
      ...prev,
      {
        playerId: player.id,
        name: player.name,
        description: player.description,
        amount: '',
        seatNumber,
        buyInAmount,
      },
    ]);
    dispatch(consumeSelectedSeat());
  };

  return { handleAddToSession };
};
