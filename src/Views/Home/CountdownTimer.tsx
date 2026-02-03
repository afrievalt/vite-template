import { zodResolver } from '@hookform/resolvers/zod';
import { useCountdown } from '@hooks/useCountdown';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const timerSchema = z.object({
  minutes: z
    .number()
    .min(1, 'Must be at least 1 minute')
    .max(999, 'Must be less than 1000 minutes'),
});

type TimerFormData = z.infer<typeof timerSchema>;

export const CountdownTimer: React.FC = () => {
  const { isRunning, minutes, reset, seconds, start } = useCountdown();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<TimerFormData>({
    defaultValues: { minutes: 5 },
    resolver: zodResolver(timerSchema),
  });

  const onSubmit = (data: TimerFormData): void => {
    start(data.minutes);
  };

  const handleReset = (): void => {
    reset();
  };

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold">Countdown Timer</h2>

      {!isRunning ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="minutes"
              className="text-sm font-medium text-gray-700"
            >
              Minutes
            </label>
            <input
              id="minutes"
              type="number"
              min="1"
              {...register('minutes', { valueAsNumber: true })}
              className="w-32 rounded-md border border-gray-300 px-3 py-2 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.minutes && (
              <span className="text-xs text-red-600">
                {errors.minutes.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Start
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl font-bold text-blue-600 tabular-nums">
            {formattedMinutes}:{formattedSeconds}
          </div>
          <button
            onClick={handleReset}
            className="rounded-md bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
