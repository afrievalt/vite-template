import { useAppDispatch, useAppSelector } from '@store/hooks';
import { decrement, increment } from '@store/slices/counterSlice';
import React from 'react';

import { CountdownTimer } from './CountdownTimer';

export const Home: React.FC = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Welcome to your Vite Template
      </h1>
      <p className="mb-8 text-gray-600">
        This template is pre-configured with React, Redux, and Firebase.
      </p>

      <CountdownTimer />

      <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold">Counter Example</h2>
        <div className="flex items-center gap-6">
          <button
            onClick={() => dispatch(decrement())}
            className="rounded-full bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
            aria-label="Decrement"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
          <span className="text-2xl font-bold tabular-nums">{count}</span>
          <button
            onClick={() => dispatch(increment())}
            className="rounded-full bg-green-100 p-2 text-green-600 transition-colors hover:bg-green-200"
            aria-label="Increment"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
