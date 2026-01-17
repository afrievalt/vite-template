import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Session {
  id: string;
  date: string; // YYYY-MM-DD
  location: string;
  game: string;
  stakes: string;
}

export interface SessionResultPayload {
  playerId: string;
  seatNumber: number;
  result: number;
}

export interface AddSessionWithResultsPayload {
  session: Session;
  results: SessionResultPayload[];
}

export interface ImportStorePayload {
  state: {
    sessions: SessionsState;
    results: { results: unknown[] };
    players: { players: unknown[] };
    counter: { value: number };
  };
  isFullStore: boolean;
}

export type ImportStoreAction = PayloadAction<ImportStorePayload>;

export interface SessionsState {
  sessions: Session[];
}

const initialState: SessionsState = {
  sessions: [],
};

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    addSession: (state, action: PayloadAction<Session>) => {
      state.sessions.push(action.payload);
    },
    addSessionWithResults: (
      state,
      action: PayloadAction<AddSessionWithResultsPayload>,
    ) => {
      state.sessions.push(action.payload.session);
    },
    removeSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter((s) => s.id !== action.payload);
    },
    clearSessions: (state) => {
      state.sessions = [];
    },
    importSessions: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload;
    },
    importStore: (state, action: PayloadAction<ImportStorePayload>) => {
      state.sessions = action.payload.state.sessions.sessions;
    },
    updateSession: (state, action: PayloadAction<Session>) => {
      const index = state.sessions.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.sessions[index] = action.payload;
      }
    },
  },
});

export const {
  addSession,
  addSessionWithResults,
  removeSession,
  clearSessions,
  importSessions,
  importStore,
  updateSession,
} = sessionsSlice.actions;
export default sessionsSlice.reducer;
