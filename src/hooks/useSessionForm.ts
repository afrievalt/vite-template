import { useState } from 'react';

import type { SessionDetails } from '../Views/Main/types';

interface UseSessionFormConfig {
  today?: string;
  initialDate?: string;
  initialLocation?: string;
  initialGame?: string;
  initialStakes?: string;
}

interface UseSessionFormResult {
  date: string;
  location: string;
  game: string;
  stakes: string;
  setDate: (value: string) => void;
  setLocation: (value: string) => void;
  setGame: (value: string) => void;
  setStakes: (value: string) => void;
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    onSubmit: (details: SessionDetails) => void,
  ) => void;
}

export const useSessionForm = (
  config: UseSessionFormConfig = {},
): UseSessionFormResult => {
  const today = config.today ?? new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState<string>(config.initialDate ?? today);
  const [location, setLocation] = useState<string>(
    config.initialLocation ?? 'Bobs House',
  );
  const [game, setGame] = useState<string>(config.initialGame ?? 'Big O');
  const [stakes, setStakes] = useState<string>(
    config.initialStakes ?? '4-8 Kill',
  );

  const resetForm = () => {
    setDate(today);
    setLocation('Bobs House');
    setGame('Big O');
    setStakes('4-8 Kill');
  };

  const buildDetails = (): SessionDetails => ({
    date,
    location: location.trim(),
    game: game.trim(),
    stakes: stakes.trim(),
  });

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    onSubmit: (details: SessionDetails) => void,
  ) => {
    event.preventDefault();
    onSubmit(buildDetails());
    resetForm();
  };

  return {
    date,
    location,
    game,
    stakes,
    setDate,
    setLocation,
    setGame,
    setStakes,
    handleSubmit,
  };
};
