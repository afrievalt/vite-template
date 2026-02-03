import { useEffect, useRef, useState } from 'react';

interface UseCountdownReturn {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  start: (minutes: number) => void;
  reset: () => void;
}

export const useCountdown = (): UseCountdownReturn => {
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = (minutes: number): void => {
    const seconds = minutes * 60;
    setTotalSeconds(seconds);
    setIsRunning(true);
  };

  const reset = (): void => {
    setIsRunning(false);
    setTotalSeconds(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, totalSeconds]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { isRunning, minutes, reset, seconds, start };
};
