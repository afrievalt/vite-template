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
}

export interface UpdateSessionResultsPayload {
  sessionId: string;
  results: Omit<Result, 'sessionId'>[];
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
      state.results = action.payload;
    },
    updateSessionResults: (
      state,
      action: PayloadAction<UpdateSessionResultsPayload>,
    ) => {
      state.results = state.results.filter(
        (result) => result.sessionId !== action.payload.sessionId,
      );
      action.payload.results.forEach((result) => {
        state.results.push({ ...result, sessionId: action.payload.sessionId });
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      addSessionWithResults,
      (state, action: PayloadAction<AddSessionWithResultsPayload>) => {
        const sessionId = action.payload.session.id;
        action.payload.results.forEach((result) => {
          state.results.push({ ...result, sessionId });
        });
      },
    );
    builder.addCase(removeSession, (state, action: PayloadAction<string>) => {
      state.results = state.results.filter(
        (result) => result.sessionId !== action.payload,
      );
    });
    builder.addCase(importStore, (state, action) => {
      state.results = action.payload.state.results.results as Result[];
    });
  },
});

export const { clearResults, importResults, updateSessionResults } =
  resultsSlice.actions;
export default resultsSlice.reducer;
