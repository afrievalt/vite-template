import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export const selectTotalBuyInsByPlayerAndSession = createSelector(
  [(state: RootState) => state.buyIns.buyIns],
  (buyIns) => {
    const totals: Record<string, Record<string, number>> = {};
    buyIns.forEach((buyIn) => {
      if (!totals[buyIn.sessionId]) {
        totals[buyIn.sessionId] = {};
      }
      if (!totals[buyIn.sessionId][buyIn.playerId]) {
        totals[buyIn.sessionId][buyIn.playerId] = 0;
      }
      totals[buyIn.sessionId][buyIn.playerId] += buyIn.amount;
    });
    return totals;
  },
);

export const selectTotalBuyInsForPlayerInSession = (
  state: RootState,
  sessionId: string | null,
  playerId: string,
): number => {
  if (!sessionId) {
    return 0;
  }
  const totals = selectTotalBuyInsByPlayerAndSession(state);
  return totals[sessionId]?.[playerId] ?? 0;
};
