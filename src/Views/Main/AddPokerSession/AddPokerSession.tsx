import React, { useEffect, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { MainCard } from '../../../components/MainCard';
import { useEditingSession } from '../../../hooks/useEditingSession';
import { useSessionDetailsSync } from '../../../hooks/useSessionDetailsSync';
import type { SessionDetails } from '../types';

import { SessionFormContent } from './SessionFormContent';
import { SessionFormProvider } from './SessionFormContext';
import { useCashOutMode } from './useCashOutMode';

interface SessionFormProps {
  currentSessionId: string | null;
  editingSessionId: string | null;
  selectedPlayers: Array<{
    playerId: string;
    name: string;
    description: string;
    amount: string;
    seatNumber: number;
    buyInAmount: number;
  }>;
  onCancelEdit: () => void;
  onDetailsChange: (details: SessionDetails) => void;
  onSeatNumberChange: (playerId: string, seatNumber: number) => void;
  onSubmit: (
    details: SessionDetails,
    cashOutValues: Record<string, number>,
  ) => void;
}

export const AddPokerSession: React.FC<SessionFormProps> = ({
  currentSessionId,
  editingSessionId,
  selectedPlayers,
  onCancelEdit,
  onDetailsChange,
  onSeatNumberChange,
  onSubmit,
}) => {
  const editingSession = useEditingSession(editingSessionId);
  const today = new Date().toISOString().slice(0, 10);
  const defaultValues = useMemo<SessionDetails>(() => {
    return {
      date: editingSession?.date ?? today,
      location: editingSession?.location ?? 'Bobs House',
      game: editingSession?.game ?? 'Big O',
      stakes: editingSession?.stakes ?? '4-8 Kill',
    };
  }, [editingSession, today]);
  const formMethods = useForm<SessionDetails>({ defaultValues });
  const { control, reset } = formMethods;
  const {
    isCashOutMode,
    cashOutValues,
    handleCashOutClick,
    handleCashOutChange,
  } = useCashOutMode(currentSessionId, editingSessionId);
  useEffect(() => reset(defaultValues), [defaultValues, reset]);
  const [date, location, game, stakes] = useWatch({
    control,
    name: ['date', 'location', 'game', 'stakes'],
  });
  useSessionDetailsSync(
    date ?? defaultValues.date,
    location ?? defaultValues.location,
    game ?? defaultValues.game,
    stakes ?? defaultValues.stakes,
    onDetailsChange,
  );
  const isEditing = editingSessionId !== null;
  const onCashOutButtonClick = () => {
    handleCashOutClick(selectedPlayers);
  };
  const handleValidSubmit = (formValues: SessionDetails) => {
    const details: SessionDetails = {
      date: formValues.date,
      location: formValues.location.trim(),
      game: formValues.game.trim(),
      stakes: formValues.stakes.trim(),
    };
    onSubmit(details, cashOutValues);
  };
  const handleFormSubmit = formMethods.handleSubmit(handleValidSubmit);

  return (
    <MainCard>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        {isEditing ? 'Edit Poker Session' : 'Add Poker Session'}
      </h2>
      <FormProvider {...formMethods}>
        <SessionFormProvider
          selectedPlayers={selectedPlayers}
          sessionId={editingSessionId ?? currentSessionId}
          isEditing={isEditing}
          isCashOutMode={isCashOutMode}
          cashOutValues={cashOutValues}
          onSeatNumberChange={onSeatNumberChange}
          onCashOutChange={handleCashOutChange}
          onCashOutClick={onCashOutButtonClick}
          onCancelEdit={onCancelEdit}
        >
          <form
            key={editingSessionId ?? 'new'}
            onSubmit={handleFormSubmit}
            className="space-y-4"
          >
            <SessionFormContent />
          </form>
        </SessionFormProvider>
      </FormProvider>
    </MainCard>
  );
};
