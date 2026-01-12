import React from 'react';

import type { SessionPlayerSelection } from '../types';

import { PlayersSection } from './PlayersSection';
import { SessionFormButtons } from './SessionFormButtons';
import { SessionFormFields } from './SessionFormFields';

interface SessionFormContentProps {
  date: string;
  location: string;
  game: string;
  stakes: string;
  selectedPlayers: SessionPlayerSelection[];
  sessionId: string | null;
  isEditing: boolean;
  isCashOutMode: boolean;
  cashOutValues: Record<string, number>;
  onDateChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onGameChange: (value: string) => void;
  onStakesChange: (value: string) => void;
  onSeatNumberChange: (playerId: string, seatNumber: number) => void;
  onCashOutChange: (playerId: string, value: number) => void;
  onCashOutClick: () => void;
  onCancelEdit: () => void;
}

export const SessionFormContent: React.FC<SessionFormContentProps> = ({
  date,
  location,
  game,
  stakes,
  selectedPlayers,
  sessionId,
  isEditing,
  isCashOutMode,
  cashOutValues,
  onDateChange,
  onLocationChange,
  onGameChange,
  onStakesChange,
  onSeatNumberChange,
  onCashOutChange,
  onCashOutClick,
  onCancelEdit,
}) => {
  return (
    <>
      <SessionFormFields
        date={date}
        game={game}
        location={location}
        stakes={stakes}
        onDateChange={onDateChange}
        onGameChange={onGameChange}
        onLocationChange={onLocationChange}
        onStakesChange={onStakesChange}
      />

      <PlayersSection
        selectedPlayers={selectedPlayers}
        sessionId={sessionId}
        isCashOutMode={isCashOutMode}
        cashOutValues={cashOutValues}
        onSeatNumberChange={onSeatNumberChange}
        onCashOutChange={onCashOutChange}
        onCashOutClick={onCashOutClick}
      />

      <SessionFormButtons
        isEditing={isEditing}
        isCashOutMode={isCashOutMode}
        onCancel={onCancelEdit}
      />
    </>
  );
};
