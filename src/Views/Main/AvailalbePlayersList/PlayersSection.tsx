import { MainCard } from '@components/MainCard';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addPlayer, type Player } from '@store/slices/playersSlice';
import { selectSeat, skipSeat } from '@store/slices/seatSkipsSlice';
import React, { useState } from 'react';

import { generateUUID } from '../../../utils/uuid';

import { PlayersForm } from './PlayersForm';
import { PlayersTable } from './PlayersTable';

interface PlayersSectionProps {
  onAddToSession: (player: Player, buyInAmount: number) => void;
  selectedPlayerIds: string[];
}

export const PlayersSection: React.FC<PlayersSectionProps> = ({
  onAddToSession,
  selectedPlayerIds,
}) => {
  const dispatch = useAppDispatch();
  const players = useAppSelector((state) => state.players.players);
  const seatSkips = useAppSelector((state) => state.seatSkips);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleAddPlayer = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    dispatch(
      addPlayer({
        id: generateUUID(),
        name: trimmedName,
        description: description.trim(),
      }),
    );

    setName('');
    setDescription('');
  };

  const availablePlayers = players.filter(
    (player) => !selectedPlayerIds.includes(player.id),
  );

  return (
    <MainCard>
      <h2 className="mb-4 text-xl font-bold text-gray-800">Players</h2>
      <PlayersForm
        name={name}
        description={description}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onAdd={handleAddPlayer}
        skippedSeats={seatSkips.skippedSeats}
        nextSeatNumber={seatSkips.nextSeatNumber}
        selectedSeatNumber={seatSkips.selectedSeatNumber}
        onSkipSeat={() => dispatch(skipSeat())}
        onSeatSelect={(seatNumber) => dispatch(selectSeat(seatNumber))}
      />
      <div className="mt-4">
        <PlayersTable players={availablePlayers} onAdd={onAddToSession} />
      </div>
    </MainCard>
  );
};
