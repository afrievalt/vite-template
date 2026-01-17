import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import {
  addSessionWithResults,
  importStore,
  removeSession,
} from './sessionsSlice';
import type { AddSessionWithResultsPayload } from './sessionsSlice';

export interface Result {
  playerId: string;
  sessionId: string;
  seatNumber: number;
  result?: number;
  cashOut?: number;
  buyIns: number[];
  buyInsTimeStamp: string[]; // ISO 8601 format
}

export type SessionResultUpdate = Omit<
  Result,
  'sessionId' | 'buyIns' | 'buyInsTimeStamp'
>;

export interface UpdateSessionResultsPayload {
  sessionId: string;
  results: SessionResultUpdate[];
}

export interface AddBuyInToResultPayload {
  playerId: string;
  sessionId: string;
  amount: number;
  seatNumber?: number;
  dateTime?: string;
}

export interface ResultsState {
  results: Result[];
}

const initialState: ResultsState = {
  results: [],
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = [];
    },
    importResults: (state, action: PayloadAction<Result[]>) => {
      state.results = action.payload.map((result) => ({
        ...result,
        buyIns: result.buyIns ?? [],
        buyInsTimeStamp: result.buyInsTimeStamp ?? [],
      }));
    },
    updateSessionResults: (
      state,
      action: PayloadAction<UpdateSessionResultsPayload>,
    ) => {
      const existingResults = state.results.filter(
        (result) => result.sessionId === action.payload.sessionId,
      );
      const existingByPlayer = new Map(
        existingResults.map((result) => [result.playerId, result]),
      );
      state.results = state.results.filter(
        (result) => result.sessionId !== action.payload.sessionId,
      );
      action.payload.results.forEach((result) => {
        const existing = existingByPlayer.get(result.playerId);
        state.results.push({
          ...result,
          sessionId: action.payload.sessionId,
          buyIns: existing?.buyIns ?? [],
          buyInsTimeStamp: existing?.buyInsTimeStamp ?? [],
        });
      });
    },
    addBuyInToResult: (
      state,
      action: PayloadAction<AddBuyInToResultPayload>,
    ) => {
      const timestamp = action.payload.dateTime ?? new Date().toISOString();
      const existing = state.results.find(
        (result) =>
          result.sessionId === action.payload.sessionId &&
          result.playerId === action.payload.playerId,
      );

      if (existing) {
        existing.buyIns = existing.buyIns ?? [];
        existing.buyInsTimeStamp = existing.buyInsTimeStamp ?? [];
        existing.buyIns.push(action.payload.amount);
        existing.buyInsTimeStamp.push(timestamp);
        if (
          action.payload.seatNumber !== undefined &&
          existing.seatNumber === 0
        ) {
          existing.seatNumber = action.payload.seatNumber;
        }
        return;
      }

      state.results.push({
        playerId: action.payload.playerId,
        sessionId: action.payload.sessionId,
        seatNumber: action.payload.seatNumber ?? 0,
        buyIns: [action.payload.amount],
        buyInsTimeStamp: [timestamp],
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      addSessionWithResults,
      (state, action: PayloadAction<AddSessionWithResultsPayload>) => {
        const sessionId = action.payload.session.id;
        action.payload.results.forEach((result) => {
          state.results.push({
            ...result,
            sessionId,
            buyIns: [],
            buyInsTimeStamp: [],
          });
        });
      },
    );
    builder.addCase(removeSession, (state, action: PayloadAction<string>) => {
      state.results = state.results.filter(
        (result) => result.sessionId !== action.payload,
      );
    });
    builder.addCase(importStore, (state, action) => {
      state.results = (action.payload.state.results.results as Result[]).map(
        (result) => ({
          ...result,
          buyIns: result.buyIns ?? [],
          buyInsTimeStamp: result.buyInsTimeStamp ?? [],
        }),
      );
    });
  },
});

export const {
  clearResults,
  importResults,
  updateSessionResults,
  addBuyInToResult,
} = resultsSlice.actions;
export default resultsSlice.reducer;
