import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { importStore, removeSession } from './sessionsSlice';

export interface BuyIn {
  id: string;
  playerId: string;
  sessionId: string;
  dateTime: string; // ISO 8601 format
  amount: number;
}

export interface AddBuyInPayload {
  playerId: string;
  sessionId: string;
  amount: number;
}

export interface BuyInsState {
  buyIns: BuyIn[];
}

const initialState: BuyInsState = {
  buyIns: [],
};

const buyinsSlice = createSlice({
  name: 'buyIns',
  initialState,
  reducers: {
    addBuyIn: (state, action: PayloadAction<BuyIn>) => {
      state.buyIns.push(action.payload);
    },
    addBuyInWithId: (
      state,
      action: PayloadAction<AddBuyInPayload & { id: string }>,
    ) => {
      state.buyIns.push({
        id: action.payload.id,
        playerId: action.payload.playerId,
        sessionId: action.payload.sessionId,
        dateTime: new Date().toISOString(),
        amount: action.payload.amount,
      });
    },
    removeBuyIn: (state, action: PayloadAction<string>) => {
      state.buyIns = state.buyIns.filter(
        (buyIn) => buyIn.id !== action.payload,
      );
    },
    clearBuyIns: (state) => {
      state.buyIns = [];
    },
    importBuyIns: (state, action: PayloadAction<BuyIn[]>) => {
      state.buyIns = action.payload;
    },
    removeBuyInsBySession: (state, action: PayloadAction<string>) => {
      state.buyIns = state.buyIns.filter(
        (buyIn) => buyIn.sessionId !== action.payload,
      );
    },
    removeBuyInsByPlayer: (state, action: PayloadAction<string>) => {
      state.buyIns = state.buyIns.filter(
        (buyIn) => buyIn.playerId !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeSession, (state, action: PayloadAction<string>) => {
      state.buyIns = state.buyIns.filter(
        (buyIn) => buyIn.sessionId !== action.payload,
      );
    });
    builder.addCase(importStore, (state, action) => {
      if (action.payload.isFullStore) {
        state.buyIns = action.payload.state.buyIns.buyIns as BuyIn[];
      }
    });
  },
});

export const {
  addBuyIn,
  addBuyInWithId,
  removeBuyIn,
  clearBuyIns,
  importBuyIns,
  removeBuyInsBySession,
  removeBuyInsByPlayer,
} = buyinsSlice.actions;
export default buyinsSlice.reducer;
