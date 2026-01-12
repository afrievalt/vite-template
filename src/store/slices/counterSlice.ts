import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { importStore } from './sessionsSlice';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    importCounter: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(importStore, (state, action) => {
      if (action.payload.isFullStore) {
        state.value = action.payload.state.counter.value;
      }
    });
  },
});

export const { increment, decrement, incrementByAmount, importCounter } =
  counterSlice.actions;
export default counterSlice.reducer;
