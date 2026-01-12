/* eslint-disable max-lines-per-function */
import { describe, expect, test } from 'vitest';

import type { RootState } from '../store';

import {
  selectCalculatedResultForPlayer,
  selectLargestLoserForSession,
  selectLargestWinnerForSession,
  selectTotalWinningsByPlayer,
} from './resultsSelectors';

const createMockState = (
  results: RootState['results']['results'],
  buyIns: RootState['buyIns']['buyIns'],
  sessions: RootState['sessions']['sessions'] = [],
): RootState => ({
  buyIns: { buyIns },
  counter: { value: 0 },
  players: { players: [] },
  results: { results },
  sessions: { sessions },
});

describe('selectCalculatedResultForPlayer', () => {
  test('should return result value when result exists', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: 100,
        },
      ],
      [],
    );

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(100);
  });

  test('should calculate result from cashOut minus buyIns when result is not set', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          cashOut: 200,
        },
      ],
      [
        {
          id: 'buyin1',
          playerId: 'player1',
          sessionId: 'session1',
          dateTime: '2024-01-01T00:00:00Z',
          amount: 50,
        },
        {
          id: 'buyin2',
          playerId: 'player1',
          sessionId: 'session1',
          dateTime: '2024-01-01T01:00:00Z',
          amount: 30,
        },
      ],
    );

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(120);
  });

  test('should return negative result when cashOut is less than buyIns', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          cashOut: 50,
        },
      ],
      [
        {
          id: 'buyin1',
          playerId: 'player1',
          sessionId: 'session1',
          dateTime: '2024-01-01T00:00:00Z',
          amount: 100,
        },
      ],
    );

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(-50);
  });

  test('should return undefined when result does not exist and cashOut is not set', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
        },
      ],
      [],
    );

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBeUndefined();
  });

  test('should return undefined when result record does not exist', () => {
    const state = createMockState([], []);

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBeUndefined();
  });

  test('should use result value even when cashOut exists', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: 75,
          cashOut: 200,
        },
      ],
      [
        {
          id: 'buyin1',
          playerId: 'player1',
          sessionId: 'session1',
          dateTime: '2024-01-01T00:00:00Z',
          amount: 50,
        },
      ],
    );

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(75);
  });

  test('should calculate result correctly with multiple buyIns', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          cashOut: 500,
        },
      ],
      [
        {
          id: 'buyin1',
          playerId: 'player1',
          sessionId: 'session1',
          dateTime: '2024-01-01T00:00:00Z',
          amount: 100,
        },
        {
          id: 'buyin2',
          playerId: 'player1',
          sessionId: 'session1',
          dateTime: '2024-01-01T01:00:00Z',
          amount: 50,
        },
        {
          id: 'buyin3',
          playerId: 'player1',
          sessionId: 'session1',
          dateTime: '2024-01-01T02:00:00Z',
          amount: 75,
        },
      ],
    );

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(275);
  });

  test('should handle zero cashOut correctly', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          cashOut: 0,
        },
      ],
      [
        {
          id: 'buyin1',
          playerId: 'player1',
          sessionId: 'session1',
          dateTime: '2024-01-01T00:00:00Z',
          amount: 100,
        },
      ],
    );

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(-100);
  });

  test('should handle zero buyIns correctly', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          cashOut: 100,
        },
      ],
      [],
    );

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(100);
  });
});

describe('selectLargestWinnerForSession', () => {
  test('should return player with highest positive result', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: 100,
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
          result: 200,
        },
        {
          playerId: 'player3',
          sessionId: 'session1',
          seatNumber: 3,
          result: 50,
        },
      ],
      [],
    );

    const winner = selectLargestWinnerForSession(state, 'session1');

    expect(winner).toBe('player2');
  });

  test('should return undefined when no positive results exist', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: -100,
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
          result: -50,
        },
      ],
      [],
    );

    const winner = selectLargestWinnerForSession(state, 'session1');

    expect(winner).toBeUndefined();
  });

  test('should return undefined when no results exist for session', () => {
    const state = createMockState([], []);

    const winner = selectLargestWinnerForSession(state, 'session1');

    expect(winner).toBeUndefined();
  });

  test('should handle ties by returning one of the winners', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: 200,
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
          result: 200,
        },
        {
          playerId: 'player3',
          sessionId: 'session1',
          seatNumber: 3,
          result: 100,
        },
      ],
      [],
    );

    const winner = selectLargestWinnerForSession(state, 'session1');

    expect(winner).toBeDefined();
    expect(['player1', 'player2']).toContain(winner);
  });

  test('should use calculated results from cashOut and buyIns', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          cashOut: 300,
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
          cashOut: 400,
        },
      ],
      [
        {
          id: 'buyin1',
          playerId: 'player1',
          sessionId: 'session1',
          dateTime: '2024-01-01T00:00:00Z',
          amount: 100,
        },
        {
          id: 'buyin2',
          playerId: 'player2',
          sessionId: 'session1',
          dateTime: '2024-01-01T00:00:00Z',
          amount: 150,
        },
      ],
    );

    const winner = selectLargestWinnerForSession(state, 'session1');

    expect(winner).toBe('player2');
  });

  test('should ignore undefined results', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: 100,
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
        },
      ],
      [],
    );

    const winner = selectLargestWinnerForSession(state, 'session1');

    expect(winner).toBe('player1');
  });
});

describe('selectLargestLoserForSession', () => {
  test('should return player with lowest (most negative) result', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: -100,
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
          result: -200,
        },
        {
          playerId: 'player3',
          sessionId: 'session1',
          seatNumber: 3,
          result: -50,
        },
      ],
      [],
    );

    const loser = selectLargestLoserForSession(state, 'session1');

    expect(loser).toBe('player2');
  });

  test('should return undefined when no negative results exist', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: 100,
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
          result: 50,
        },
      ],
      [],
    );

    const loser = selectLargestLoserForSession(state, 'session1');

    expect(loser).toBeUndefined();
  });

  test('should return undefined when no results exist for session', () => {
    const state = createMockState([], []);

    const loser = selectLargestLoserForSession(state, 'session1');

    expect(loser).toBeUndefined();
  });

  test('should handle ties by returning one of the losers', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: -200,
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
          result: -200,
        },
        {
          playerId: 'player3',
          sessionId: 'session1',
          seatNumber: 3,
          result: -100,
        },
      ],
      [],
    );

    const loser = selectLargestLoserForSession(state, 'session1');

    expect(loser).toBeDefined();
    expect(['player1', 'player2']).toContain(loser);
  });

  test('should use calculated results from cashOut and buyIns', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          cashOut: 50,
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
          cashOut: 100,
        },
      ],
      [
        {
          id: 'buyin1',
          playerId: 'player1',
          sessionId: 'session1',
          dateTime: '2024-01-01T00:00:00Z',
          amount: 200,
        },
        {
          id: 'buyin2',
          playerId: 'player2',
          sessionId: 'session1',
          dateTime: '2024-01-01T00:00:00Z',
          amount: 300,
        },
      ],
    );

    const loser = selectLargestLoserForSession(state, 'session1');

    expect(loser).toBe('player2');
  });

  test('should ignore undefined results', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: -100,
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
        },
      ],
      [],
    );

    const loser = selectLargestLoserForSession(state, 'session1');

    expect(loser).toBe('player1');
  });
});

describe('selectTotalWinningsByPlayer', () => {
  test('should return empty object when no sessions exist', () => {
    const state = createMockState([], [], []);

    const totals = selectTotalWinningsByPlayer(state);

    expect(totals).toEqual({});
  });

  test('should calculate total winnings for a single player across multiple sessions', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: 100,
        },
        {
          playerId: 'player1',
          sessionId: 'session2',
          seatNumber: 1,
          result: 50,
        },
      ],
      [],
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: 'NLHE',
          stakes: '1/2',
        },
        {
          id: 'session2',
          date: '2024-01-02',
          location: 'Home',
          game: 'NLHE',
          stakes: '1/2',
        },
      ],
    );

    const totals = selectTotalWinningsByPlayer(state);

    expect(totals).toEqual({ player1: 150 });
  });

  test('should calculate total winnings for multiple players', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: 100,
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
          result: -50,
        },
        {
          playerId: 'player1',
          sessionId: 'session2',
          seatNumber: 1,
          result: 75,
        },
        {
          playerId: 'player2',
          sessionId: 'session2',
          seatNumber: 2,
          result: -25,
        },
      ],
      [],
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: 'NLHE',
          stakes: '1/2',
        },
        {
          id: 'session2',
          date: '2024-01-02',
          location: 'Home',
          game: 'NLHE',
          stakes: '1/2',
        },
      ],
    );

    const totals = selectTotalWinningsByPlayer(state);

    expect(totals).toEqual({ player1: 175, player2: -75 });
  });

  test('should handle calculated results from cashOut and buyIns', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          cashOut: 200,
        },
        {
          playerId: 'player1',
          sessionId: 'session2',
          seatNumber: 1,
          cashOut: 150,
        },
      ],
      [
        {
          id: 'buyin1',
          playerId: 'player1',
          sessionId: 'session1',
          dateTime: '2024-01-01T00:00:00Z',
          amount: 100,
        },
        {
          id: 'buyin2',
          playerId: 'player1',
          sessionId: 'session2',
          dateTime: '2024-01-02T00:00:00Z',
          amount: 50,
        },
      ],
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: 'NLHE',
          stakes: '1/2',
        },
        {
          id: 'session2',
          date: '2024-01-02',
          location: 'Home',
          game: 'NLHE',
          stakes: '1/2',
        },
      ],
    );

    const totals = selectTotalWinningsByPlayer(state);

    expect(totals).toEqual({ player1: 200 });
  });

  test('should ignore undefined results', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: 100,
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
        },
      ],
      [],
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: 'NLHE',
          stakes: '1/2',
        },
      ],
    );

    const totals = selectTotalWinningsByPlayer(state);

    expect(totals).toEqual({ player1: 100 });
  });

  test('should handle negative totals (losses)', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: -100,
        },
        {
          playerId: 'player1',
          sessionId: 'session2',
          seatNumber: 1,
          result: -50,
        },
      ],
      [],
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: 'NLHE',
          stakes: '1/2',
        },
        {
          id: 'session2',
          date: '2024-01-02',
          location: 'Home',
          game: 'NLHE',
          stakes: '1/2',
        },
      ],
    );

    const totals = selectTotalWinningsByPlayer(state);

    expect(totals).toEqual({ player1: -150 });
  });

  test('should handle mixed positive and negative results', () => {
    const state = createMockState(
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: 200,
        },
        {
          playerId: 'player1',
          sessionId: 'session2',
          seatNumber: 1,
          result: -100,
        },
        {
          playerId: 'player1',
          sessionId: 'session3',
          seatNumber: 1,
          result: 50,
        },
      ],
      [],
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: 'NLHE',
          stakes: '1/2',
        },
        {
          id: 'session2',
          date: '2024-01-02',
          location: 'Home',
          game: 'NLHE',
          stakes: '1/2',
        },
        {
          id: 'session3',
          date: '2024-01-03',
          location: 'Home',
          game: 'NLHE',
          stakes: '1/2',
        },
      ],
    );

    const totals = selectTotalWinningsByPlayer(state);

    expect(totals).toEqual({ player1: 150 });
  });
});
