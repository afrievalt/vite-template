import { useAppDispatch } from '../store/hooks';
import { updateSessionResults } from '../store/slices/resultsSlice';
import { updateSession } from '../store/slices/sessionsSlice';
import type {
  SessionDetails,
  SessionPlayerSelection,
} from '../Views/Main/types';

const parseAmount = (value: string): number => {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 0;
  return parsed;
};

interface UseSessionSubmitResult {
  handleSubmit: (
    details: SessionDetails,
    selectedPlayers: SessionPlayerSelection[],
    sessionId: string | null,
    cashOutValues: Record<string, number>,
    onComplete: () => void,
  ) => void;
}

export const useSessionSubmit = (): UseSessionSubmitResult => {
  const dispatch = useAppDispatch();

  const handleSubmit = (
    details: SessionDetails,
    selectedPlayers: SessionPlayerSelection[],
    sessionId: string | null,
    cashOutValues: Record<string, number>,
    onComplete: () => void,
  ) => {
    if (!sessionId) return;

    const resultsPayload = selectedPlayers.map((player) => {
      const cashOut = cashOutValues[player.playerId];
      const isCashOutMode = cashOut !== undefined;

      return {
        playerId: player.playerId,
        seatNumber: player.seatNumber,
        result: isCashOutMode ? undefined : parseAmount(player.amount),
        cashOut: isCashOutMode ? cashOut : undefined,
      };
    });

    dispatch(
      updateSession({
        id: sessionId,
        date: details.date,
        location: details.location,
        game: details.game,
        stakes: details.stakes,
      }),
    );
    dispatch(
      updateSessionResults({
        sessionId,
        results: resultsPayload,
      }),
    );

    onComplete();
  };

  return { handleSubmit };
};
