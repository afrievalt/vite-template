import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SeatSkipsState {
  skippedSeats: number[];
  nextSeatNumber: number;
  selectedSeatNumber: number;
}

export interface InitializeSeatSkipsPayload {
  assignedSeats: number[];
}

const initialState: SeatSkipsState = {
  skippedSeats: [],
  nextSeatNumber: 1,
  selectedSeatNumber: 1,
};

const normalizeSeatNumbers = (seats: number[]): number[] =>
  seats.filter((seat) => seat > 0).sort((a, b) => a - b);

const getSkippedSeats = (seats: number[]): number[] => {
  if (seats.length === 0) {
    return [];
  }
  const maxSeat = seats[seats.length - 1];
  const seatSet = new Set(seats);
  const skipped: number[] = [];
  for (let seat = 1; seat <= maxSeat; seat += 1) {
    if (!seatSet.has(seat)) {
      skipped.push(seat);
    }
  }
  return skipped;
};

const getNextSeatNumber = (seats: number[]): number =>
  seats.length === 0 ? 1 : seats[seats.length - 1] + 1;

const seatSkipsSlice = createSlice({
  name: 'seatSkips',
  initialState,
  reducers: {
    resetSeatSkips: () => initialState,
    initializeSeatSkips: (
      state,
      action: PayloadAction<InitializeSeatSkipsPayload>,
    ) => {
      const assignedSeats = normalizeSeatNumbers(action.payload.assignedSeats);
      state.skippedSeats = getSkippedSeats(assignedSeats);
      state.nextSeatNumber = getNextSeatNumber(assignedSeats);
      state.selectedSeatNumber = state.nextSeatNumber;
    },
    skipSeat: (state) => {
      if (!state.skippedSeats.includes(state.nextSeatNumber)) {
        state.skippedSeats.push(state.nextSeatNumber);
        state.skippedSeats.sort((a, b) => a - b);
      }
      state.nextSeatNumber += 1;
      state.selectedSeatNumber = state.nextSeatNumber;
    },
    selectSeat: (state, action: PayloadAction<number>) => {
      state.selectedSeatNumber = action.payload;
    },
    consumeSelectedSeat: (state) => {
      const selected = state.selectedSeatNumber;
      const skippedIndex = state.skippedSeats.indexOf(selected);
      if (skippedIndex >= 0) {
        state.skippedSeats.splice(skippedIndex, 1);
      } else if (selected === state.nextSeatNumber) {
        state.nextSeatNumber += 1;
      }
      state.selectedSeatNumber = state.nextSeatNumber;
    },
  },
});

export const {
  consumeSelectedSeat,
  initializeSeatSkips,
  resetSeatSkips,
  selectSeat,
  skipSeat,
} = seatSkipsSlice.actions;
export default seatSkipsSlice.reducer;
