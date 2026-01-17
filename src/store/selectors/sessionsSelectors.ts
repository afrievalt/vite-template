import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';

import {
  selectCalculatedResultForPlayer,
  selectLargestLoserForSession,
  selectLargestWinnerForSession,
} from './resultsSelectors';

export interface SessionRow {
  id: string;
  date: string;
  location: string;
  game: string;
  stakes: string;
  players: { id: string; name: string; amount: number }[];
}

export const selectSessionRows = createSelector(
  [
    (state: RootState) => state.sessions.sessions,
    (state: RootState) => state.results.results,
    (state: RootState) => state.players.players,
  ],
  (sessions, results, players): SessionRow[] => {
    const partialState = {
      sessions: { sessions },
      results: { results },
      players: { players },
    } as RootState;

    return sessions.map((session) => {
      const sessionResults = results.filter(
        (result) => result.sessionId === session.id,
      );

      const allPlayerRows = sessionResults.map((entry) => {
        const player = players.find((p) => p.id === entry.playerId);
        const calculatedResult = selectCalculatedResultForPlayer(
          partialState,
          session.id,
          entry.playerId,
        );
        return {
          id: entry.playerId,
          name: player?.name ?? 'Unknown',
          amount: calculatedResult ?? 0,
        };
      });

      const largestWinnerId = selectLargestWinnerForSession(
        partialState,
        session.id,
      );
      const largestLoserId = selectLargestLoserForSession(
        partialState,
        session.id,
      );
      const mePlayer = players.find((p) => p.description === 'ME');
      const mePlayerId = mePlayer?.id;

      const orderedPlayerRows: typeof allPlayerRows = [];

      if (largestWinnerId) {
        const winnerRow = allPlayerRows.find(
          (row) => row.id === largestWinnerId,
        );
        if (winnerRow) {
          orderedPlayerRows.push(winnerRow);
        }
      }

      if (mePlayerId) {
        const meRow = allPlayerRows.find((row) => row.id === mePlayerId);
        if (meRow && !orderedPlayerRows.some((row) => row.id === mePlayerId)) {
          orderedPlayerRows.push(meRow);
        }
      }

      if (largestLoserId) {
        const loserRow = allPlayerRows.find((row) => row.id === largestLoserId);
        if (
          loserRow &&
          !orderedPlayerRows.some((row) => row.id === largestLoserId)
        ) {
          orderedPlayerRows.push(loserRow);
        }
      }

      return { ...session, players: orderedPlayerRows };
    });
  },
);
