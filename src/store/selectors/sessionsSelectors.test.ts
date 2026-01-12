/* eslint-disable max-lines-per-function */
import { describe, expect, test } from 'vitest';

import type { RootState } from '../store';

import { selectSessionRows } from './sessionsSelectors';

const createMockState = (
  sessions: RootState['sessions']['sessions'],
  results: RootState['results']['results'],
  players: RootState['players']['players'],
  buyIns: RootState['buyIns']['buyIns'],
): RootState => ({
  buyIns: { buyIns },
  counter: { value: 0 },
  players: { players },
  results: { results },
  sessions: { sessions },
});

describe('selectSessionRows', () => {
  test('should return empty array when no sessions exist', () => {
    const state = createMockState([], [], [], []);

    const rows = selectSessionRows(state);

    expect(rows).toEqual([]);
  });

  test('should return session rows with players ordered by winner, me, loser', () => {
    const state = createMockState(
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: "Texas Hold'em",
          stakes: '1/2',
        },
      ],
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
          result: -100,
        },
        {
          playerId: 'player3',
          sessionId: 'session1',
          seatNumber: 3,
          result: 50,
        },
        {
          playerId: 'player4',
          sessionId: 'session1',
          seatNumber: 4,
          result: -150,
        },
      ],
      [
        { id: 'player1', name: 'Winner', description: '' },
        { id: 'player2', name: 'Loser1', description: '' },
        { id: 'player3', name: 'SmallWinner', description: '' },
        { id: 'player4', name: 'BigLoser', description: 'ME' },
      ],
      [],
    );

    const rows = selectSessionRows(state);

    expect(rows).toHaveLength(1);
    expect(rows[0].players).toHaveLength(2);
    expect(rows[0].players[0].id).toBe('player1');
    expect(rows[0].players[0].name).toBe('Winner');
    expect(rows[0].players[1].id).toBe('player4');
    expect(rows[0].players[1].name).toBe('BigLoser');
  });

  test('should use calculated results from cashOut and buyIns', () => {
    const state = createMockState(
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: "Texas Hold'em",
          stakes: '1/2',
        },
      ],
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
          cashOut: 50,
        },
      ],
      [
        { id: 'player1', name: 'Player1', description: '' },
        { id: 'player2', name: 'Player2', description: 'ME' },
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
          amount: 200,
        },
      ],
    );

    const rows = selectSessionRows(state);

    expect(rows).toHaveLength(1);
    expect(rows[0].players).toHaveLength(2);
    expect(rows[0].players[0].amount).toBe(200);
    expect(rows[0].players[1].amount).toBe(-150);
  });

  test('should handle session with no results', () => {
    const state = createMockState(
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: "Texas Hold'em",
          stakes: '1/2',
        },
      ],
      [],
      [],
      [],
    );

    const rows = selectSessionRows(state);

    expect(rows).toHaveLength(1);
    expect(rows[0].players).toHaveLength(0);
  });

  test('should handle missing player names', () => {
    const state = createMockState(
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: "Texas Hold'em",
          stakes: '1/2',
        },
      ],
      [
        {
          playerId: 'unknown-player',
          sessionId: 'session1',
          seatNumber: 1,
          result: 100,
        },
      ],
      [],
      [],
    );

    const rows = selectSessionRows(state);

    expect(rows).toHaveLength(1);
    expect(rows[0].players).toHaveLength(1);
    expect(rows[0].players[0].name).toBe('Unknown');
  });

  test('should not duplicate players if me is also winner or loser', () => {
    const state = createMockState(
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: "Texas Hold'em",
          stakes: '1/2',
        },
      ],
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
          result: -100,
        },
      ],
      [
        { id: 'player1', name: 'ME', description: 'ME' },
        { id: 'player2', name: 'Other', description: '' },
      ],
      [],
    );

    const rows = selectSessionRows(state);

    expect(rows).toHaveLength(1);
    expect(rows[0].players).toHaveLength(2);
    expect(rows[0].players[0].id).toBe('player1');
    expect(rows[0].players[1].id).toBe('player2');
  });

  test('should handle multiple sessions', () => {
    const state = createMockState(
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: "Texas Hold'em",
          stakes: '1/2',
        },
        {
          id: 'session2',
          date: '2024-01-02',
          location: 'Casino',
          game: 'Omaha',
          stakes: '2/4',
        },
      ],
      [
        {
          playerId: 'player1',
          sessionId: 'session1',
          seatNumber: 1,
          result: 100,
        },
        {
          playerId: 'player2',
          sessionId: 'session2',
          seatNumber: 1,
          result: 200,
        },
      ],
      [
        { id: 'player1', name: 'Player1', description: '' },
        { id: 'player2', name: 'Player2', description: '' },
      ],
      [],
    );

    const rows = selectSessionRows(state);

    expect(rows).toHaveLength(2);
    expect(rows[0].id).toBe('session1');
    expect(rows[0].players).toHaveLength(1);
    expect(rows[1].id).toBe('session2');
    expect(rows[1].players).toHaveLength(1);
  });

  test('should handle session with only positive results', () => {
    const state = createMockState(
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: "Texas Hold'em",
          stakes: '1/2',
        },
      ],
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
      [
        { id: 'player1', name: 'Player1', description: '' },
        { id: 'player2', name: 'Player2', description: 'ME' },
      ],
      [],
    );

    const rows = selectSessionRows(state);

    expect(rows).toHaveLength(1);
    expect(rows[0].players).toHaveLength(2);
    expect(rows[0].players[0].id).toBe('player1');
    expect(rows[0].players[1].id).toBe('player2');
  });

  test('should handle session with only negative results', () => {
    const state = createMockState(
      [
        {
          id: 'session1',
          date: '2024-01-01',
          location: 'Home',
          game: "Texas Hold'em",
          stakes: '1/2',
        },
      ],
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
      [
        { id: 'player1', name: 'Player1', description: 'ME' },
        { id: 'player2', name: 'Player2', description: '' },
      ],
      [],
    );

    const rows = selectSessionRows(state);

    expect(rows).toHaveLength(1);
    expect(rows[0].players).toHaveLength(1);
    expect(rows[0].players[0].id).toBe('player1');
  });
});
