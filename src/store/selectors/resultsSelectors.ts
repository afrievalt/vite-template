import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';

import { selectTotalBuyInsByPlayerAndSession } from './buyinsSelectors';

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

  const buyInsTotals = selectTotalBuyInsByPlayerAndSession(state);
  const buyIns = buyInsTotals[sessionId]?.[playerId] ?? 0;

  return result.cashOut - buyIns;
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
    (state: RootState) => state.buyIns.buyIns,
  ],
  (sessions, results, buyIns): Record<string, number> => {
    const totals: Record<string, number> = {};

    const fullState = {
      sessions: { sessions },
      results: { results },
      players: { players: [] },
      buyIns: { buyIns },
      counter: { value: 0 },
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
