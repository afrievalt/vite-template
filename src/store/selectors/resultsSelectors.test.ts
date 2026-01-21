/* eslint-disable max-lines-per-function */
import { describe, expect, test } from 'vitest';

import type { RootState } from '../store';

import {
  selectCalculatedResultForPlayer,
  selectLargestLoserForSession,
  selectLargestWinnerForSession,
  selectTotalBuyInsByPlayerAndSession,
  selectTotalWinningsByPlayer,
} from './resultsSelectors';

const createMockState = (
  results: RootState['results']['results'],
  sessions: RootState['sessions']['sessions'] = [],
): RootState => ({
  counter: { value: 0 },
  players: { players: [] },
  results: { results },
  seatSkips: { skippedSeats: [], nextSeatNumber: 1, selectedSeatNumber: 1 },
  sessions: { sessions },
});

describe('selectCalculatedResultForPlayer', () => {
  test('should return result value when result exists', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        result: 100,
        buyIns: [],
        buyInsTimeStamp: [],
      },
    ]);

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(100);
  });

  test('should calculate result from cashOut minus buyIns when result is not set', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        cashOut: 200,
        buyIns: [50, 30],
        buyInsTimeStamp: ['2024-01-01T00:00:00Z', '2024-01-01T01:00:00Z'],
      },
    ]);

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(120);
  });

  test('should return negative result when cashOut is less than buyIns', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        cashOut: 50,
        buyIns: [100],
        buyInsTimeStamp: ['2024-01-01T00:00:00Z'],
      },
    ]);

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(-50);
  });

  test('should return undefined when result does not exist and cashOut is not set', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        buyIns: [],
        buyInsTimeStamp: [],
      },
    ]);

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBeUndefined();
  });

  test('should return undefined when result record does not exist', () => {
    const state = createMockState([]);

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBeUndefined();
  });

  test('should use result value even when cashOut exists', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        result: 75,
        cashOut: 200,
        buyIns: [50],
        buyInsTimeStamp: ['2024-01-01T00:00:00Z'],
      },
    ]);

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(75);
  });

  test('should calculate result correctly with multiple buyIns', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        cashOut: 500,
        buyIns: [100, 50, 75],
        buyInsTimeStamp: [
          '2024-01-01T00:00:00Z',
          '2024-01-01T01:00:00Z',
          '2024-01-01T02:00:00Z',
        ],
      },
    ]);

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(275);
  });

  test('should handle zero cashOut correctly', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        cashOut: 0,
        buyIns: [100],
        buyInsTimeStamp: ['2024-01-01T00:00:00Z'],
      },
    ]);

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(-100);
  });

  test('should handle zero buyIns correctly', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        cashOut: 100,
        buyIns: [],
        buyInsTimeStamp: [],
      },
    ]);

    const result = selectCalculatedResultForPlayer(
      state,
      'session1',
      'player1',
    );

    expect(result).toBe(100);
  });
});

describe('selectTotalBuyInsByPlayerAndSession', () => {
  test('should return empty object when no results exist', () => {
    const state = createMockState([]);

    const totals = selectTotalBuyInsByPlayerAndSession(state);

    expect(totals).toEqual({});
  });

  test('should aggregate buyIns by session and player', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        buyIns: [50, 25],
        buyInsTimeStamp: ['2024-01-01T00:00:00Z', '2024-01-01T01:00:00Z'],
      },
      {
        playerId: 'player2',
        sessionId: 'session1',
        seatNumber: 2,
        buyIns: [100],
        buyInsTimeStamp: ['2024-01-01T02:00:00Z'],
      },
      {
        playerId: 'player1',
        sessionId: 'session2',
        seatNumber: 1,
        buyIns: [75],
        buyInsTimeStamp: ['2024-01-02T00:00:00Z'],
      },
    ]);

    const totals = selectTotalBuyInsByPlayerAndSession(state);

    expect(totals).toEqual({
      session1: { player1: 75, player2: 100 },
      session2: { player1: 75 },
    });
  });
});

describe('selectLargestWinnerForSession', () => {
  test('should return player with highest positive result', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        result: 100,
        buyIns: [],
        buyInsTimeStamp: [],
      },
      {
        playerId: 'player2',
        sessionId: 'session1',
        seatNumber: 2,
        result: 200,
        buyIns: [],
        buyInsTimeStamp: [],
      },
      {
        playerId: 'player3',
        sessionId: 'session1',
        seatNumber: 3,
        result: 50,
        buyIns: [],
        buyInsTimeStamp: [],
      },
    ]);

    const winner = selectLargestWinnerForSession(state, 'session1');

    expect(winner).toBe('player2');
  });

  test('should return undefined when no positive results exist', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        result: -100,
        buyIns: [],
        buyInsTimeStamp: [],
      },
      {
        playerId: 'player2',
        sessionId: 'session1',
        seatNumber: 2,
        result: -50,
        buyIns: [],
        buyInsTimeStamp: [],
      },
    ]);

    const winner = selectLargestWinnerForSession(state, 'session1');

    expect(winner).toBeUndefined();
  });

  test('should return undefined when no results exist for session', () => {
    const state = createMockState([]);

    const winner = selectLargestWinnerForSession(state, 'session1');

    expect(winner).toBeUndefined();
  });

  test('should handle ties by returning one of the winners', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        result: 200,
        buyIns: [],
        buyInsTimeStamp: [],
      },
      {
        playerId: 'player2',
        sessionId: 'session1',
        seatNumber: 2,
        result: 200,
        buyIns: [],
        buyInsTimeStamp: [],
      },
      {
        playerId: 'player3',
        sessionId: 'session1',
        seatNumber: 3,
        result: 100,
        buyIns: [],
        buyInsTimeStamp: [],
      },
    ]);

    const winner = selectLargestWinnerForSession(state, 'session1');

    expect(winner).toBeDefined();
    expect(['player1', 'player2']).toContain(winner);
  });

  test('should use calculated results from cashOut and buyIns', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        cashOut: 300,
        buyIns: [100],
        buyInsTimeStamp: ['2024-01-01T00:00:00Z'],
      },
      {
        playerId: 'player2',
        sessionId: 'session1',
        seatNumber: 2,
        cashOut: 400,
        buyIns: [150],
        buyInsTimeStamp: ['2024-01-01T00:00:00Z'],
      },
    ]);

    const winner = selectLargestWinnerForSession(state, 'session1');

    expect(winner).toBe('player2');
  });

  test('should ignore undefined results', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        result: 100,
        buyIns: [],
        buyInsTimeStamp: [],
      },
      {
        playerId: 'player2',
        sessionId: 'session1',
        seatNumber: 2,
        buyIns: [],
        buyInsTimeStamp: [],
      },
    ]);

    const winner = selectLargestWinnerForSession(state, 'session1');

    expect(winner).toBe('player1');
  });
});

describe('selectLargestLoserForSession', () => {
  test('should return player with lowest (most negative) result', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        result: -100,
        buyIns: [],
        buyInsTimeStamp: [],
      },
      {
        playerId: 'player2',
        sessionId: 'session1',
        seatNumber: 2,
        result: -200,
        buyIns: [],
        buyInsTimeStamp: [],
      },
      {
        playerId: 'player3',
        sessionId: 'session1',
        seatNumber: 3,
        result: -50,
        buyIns: [],
        buyInsTimeStamp: [],
      },
    ]);

    const loser = selectLargestLoserForSession(state, 'session1');

    expect(loser).toBe('player2');
  });

  test('should return undefined when no negative results exist', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        result: 100,
        buyIns: [],
        buyInsTimeStamp: [],
      },
      {
        playerId: 'player2',
        sessionId: 'session1',
        seatNumber: 2,
        result: 50,
        buyIns: [],
        buyInsTimeStamp: [],
      },
    ]);

    const loser = selectLargestLoserForSession(state, 'session1');

    expect(loser).toBeUndefined();
  });

  test('should return undefined when no results exist for session', () => {
    const state = createMockState([]);

    const loser = selectLargestLoserForSession(state, 'session1');

    expect(loser).toBeUndefined();
  });

  test('should handle ties by returning one of the losers', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        result: -200,
        buyIns: [],
        buyInsTimeStamp: [],
      },
      {
        playerId: 'player2',
        sessionId: 'session1',
        seatNumber: 2,
        result: -200,
        buyIns: [],
        buyInsTimeStamp: [],
      },
      {
        playerId: 'player3',
        sessionId: 'session1',
        seatNumber: 3,
        result: -100,
        buyIns: [],
        buyInsTimeStamp: [],
      },
    ]);

    const loser = selectLargestLoserForSession(state, 'session1');

    expect(loser).toBeDefined();
    expect(['player1', 'player2']).toContain(loser);
  });

  test('should use calculated results from cashOut and buyIns', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        cashOut: 50,
        buyIns: [200],
        buyInsTimeStamp: ['2024-01-01T00:00:00Z'],
      },
      {
        playerId: 'player2',
        sessionId: 'session1',
        seatNumber: 2,
        cashOut: 100,
        buyIns: [300],
        buyInsTimeStamp: ['2024-01-01T00:00:00Z'],
      },
    ]);

    const loser = selectLargestLoserForSession(state, 'session1');

    expect(loser).toBe('player2');
  });

  test('should ignore undefined results', () => {
    const state = createMockState([
      {
        playerId: 'player1',
        sessionId: 'session1',
        seatNumber: 1,
        result: -100,
        buyIns: [],
        buyInsTimeStamp: [],
      },
      {
        playerId: 'player2',
        sessionId: 'session1',
        seatNumber: 2,
        buyIns: [],
        buyInsTimeStamp: [],
      },
    ]);

    const loser = selectLargestLoserForSession(state, 'session1');

    expect(loser).toBe('player1');
  });
});

describe('selectTotalWinningsByPlayer', () => {
  test('should return empty object when no sessions exist', () => {
    const state = createMockState([], []);

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
          buyIns: [],
          buyInsTimeStamp: [],
        },
        {
          playerId: 'player1',
          sessionId: 'session2',
          seatNumber: 1,
          result: 50,
          buyIns: [],
          buyInsTimeStamp: [],
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
          buyIns: [],
          buyInsTimeStamp: [],
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
          result: -50,
          buyIns: [],
          buyInsTimeStamp: [],
        },
        {
          playerId: 'player1',
          sessionId: 'session2',
          seatNumber: 1,
          result: 75,
          buyIns: [],
          buyInsTimeStamp: [],
        },
        {
          playerId: 'player2',
          sessionId: 'session2',
          seatNumber: 2,
          result: -25,
          buyIns: [],
          buyInsTimeStamp: [],
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
          buyIns: [100],
          buyInsTimeStamp: ['2024-01-01T00:00:00Z'],
        },
        {
          playerId: 'player1',
          sessionId: 'session2',
          seatNumber: 1,
          cashOut: 150,
          buyIns: [50],
          buyInsTimeStamp: ['2024-01-02T00:00:00Z'],
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
          buyIns: [],
          buyInsTimeStamp: [],
        },
        {
          playerId: 'player2',
          sessionId: 'session1',
          seatNumber: 2,
          buyIns: [],
          buyInsTimeStamp: [],
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
          buyIns: [],
          buyInsTimeStamp: [],
        },
        {
          playerId: 'player1',
          sessionId: 'session2',
          seatNumber: 1,
          result: -50,
          buyIns: [],
          buyInsTimeStamp: [],
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
          buyIns: [],
          buyInsTimeStamp: [],
        },
        {
          playerId: 'player1',
          sessionId: 'session2',
          seatNumber: 1,
          result: -100,
          buyIns: [],
          buyInsTimeStamp: [],
        },
        {
          playerId: 'player1',
          sessionId: 'session3',
          seatNumber: 1,
          result: 50,
          buyIns: [],
          buyInsTimeStamp: [],
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
