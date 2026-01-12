import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { importStore } from './sessionsSlice';

export interface Player {
  id: string;
  name: string;
  description: string;
}

export interface PlayersState {
  players: Player[];
}

const initialState: PlayersState = {
  players: [],
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players.push(action.payload);
    },
    removePlayer: (state, action: PayloadAction<string>) => {
      state.players = state.players.filter(
        (player) => player.id !== action.payload,
      );
    },
    clearPlayers: (state) => {
      state.players = [];
    },
    importPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(importStore, (state, action) => {
      if (action.payload.isFullStore) {
        state.players = action.payload.state.players.players as Player[];
      }
    });
  },
});

export const { addPlayer, removePlayer, clearPlayers, importPlayers } =
  playersSlice.actions;
export default playersSlice.reducer;
