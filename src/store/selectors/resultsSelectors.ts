import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export const selectTotalBuyInsByPlayerAndSession = createSelector(
  [(state: RootState) => state.results.results],
  (results) => {
    const totals: Record<string, Record<string, number>> = {};
    results.forEach((result) => {
      const { sessionId, buyIns = [], playerId } = result;

      if (!totals[sessionId]) {
        totals[sessionId] = {};
      }
      if (!totals[sessionId][playerId]) {
        totals[sessionId][playerId] = 0;
      }
      totals[sessionId][playerId] += buyIns.reduce(
        (sum, amount) => sum + amount,
        0,
      );
    });
    return totals;
  },
);

export const selectCalculatedResultForPlayer = (
  state: RootState,
  sessionId: string,
  playerId: string,
): number | undefined => {
  const result = state.results.results.find(
    (r) => r.sessionId === sessionId && r.playerId === playerId,
  );

  if (!result) {
    return undefined;
  }

  if (result.result !== undefined) {
    return result.result;
  }

  if (result.cashOut === undefined) {
    return undefined;
  }

  const buyInsTotal = (result.buyIns ?? []).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  return result.cashOut - buyInsTotal;
};

export const selectLargestWinnerForSession = (
  state: RootState,
  sessionId: string,
): string | undefined => {
  const sessionResults = state.results.results.filter(
    (r) => r.sessionId === sessionId,
  );

  if (sessionResults.length === 0) {
    return undefined;
  }

  let largestWinnerId: string | undefined;
  let largestWinnerAmount: number | undefined;

  for (const result of sessionResults) {
    const calculatedResult = selectCalculatedResultForPlayer(
      state,
      sessionId,
      result.playerId,
    );

    if (calculatedResult === undefined) {
      continue;
    }

    if (
      calculatedResult > 0 &&
      (largestWinnerAmount === undefined ||
        calculatedResult > largestWinnerAmount)
    ) {
      largestWinnerAmount = calculatedResult;
      largestWinnerId = result.playerId;
    }
  }

  return largestWinnerId;
};

export const selectLargestLoserForSession = (
  state: RootState,
  sessionId: string,
): string | undefined => {
  const sessionResults = state.results.results.filter(
    (r) => r.sessionId === sessionId,
  );

  if (sessionResults.length === 0) {
    return undefined;
  }

  let largestLoserId: string | undefined;
  let largestLoserAmount: number | undefined;

  for (const result of sessionResults) {
    const calculatedResult = selectCalculatedResultForPlayer(
      state,
      sessionId,
      result.playerId,
    );

    if (calculatedResult === undefined) {
      continue;
    }

    if (
      calculatedResult < 0 &&
      (largestLoserAmount === undefined ||
        calculatedResult < largestLoserAmount)
    ) {
      largestLoserAmount = calculatedResult;
      largestLoserId = result.playerId;
    }
  }

  return largestLoserId;
};

export const selectTotalWinningsByPlayer = createSelector(
  [
    (state: RootState) => state.sessions.sessions,
    (state: RootState) => state.results.results,
  ],
  (sessions, results): Record<string, number> => {
    const totals: Record<string, number> = {};

    const fullState = {
      sessions: { sessions },
      results: { results },
      players: { players: [] },
      counter: { value: 0 },
      seatSkips: {
        skippedSeats: [],
        nextSeatNumber: 1,
        selectedSeatNumber: 1,
      },
    } as RootState;

    for (const session of sessions) {
      const sessionResults = results.filter((r) => r.sessionId === session.id);

      for (const result of sessionResults) {
        const calculatedResult = selectCalculatedResultForPlayer(
          fullState,
          session.id,
          result.playerId,
        );

        if (calculatedResult !== undefined) {
          totals[result.playerId] =
            (totals[result.playerId] ?? 0) + calculatedResult;
        }
      }
    }

    return totals;
  },
);
