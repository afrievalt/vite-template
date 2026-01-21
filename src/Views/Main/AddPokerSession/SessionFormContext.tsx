import React, { createContext, useContext } from 'react';

import type { SessionPlayerSelection } from '../types';

interface SessionFormContextValue {
  selectedPlayers: SessionPlayerSelection[];
  sessionId: string | null;
  isEditing: boolean;
  isCashOutMode: boolean;
  cashOutValues: Record<string, number>;
  onSeatNumberChange: (playerId: string, seatNumber: number) => void;
  onCashOutChange: (playerId: string, value: number) => void;
  onCashOutClick: () => void;
  onCancelEdit: () => void;
}

interface SessionFormProviderProps extends SessionFormContextValue {
  children: React.ReactNode;
}

const SessionFormContext = createContext<SessionFormContextValue | null>(null);

export const SessionFormProvider: React.FC<SessionFormProviderProps> = ({
  children,
  ...value
}) => {
  return (
    <SessionFormContext.Provider value={value}>
      {children}
    </SessionFormContext.Provider>
  );
};

export const useSessionFormContext = (): SessionFormContextValue => {
  const context = useContext(SessionFormContext);
  if (!context) {
    throw new Error(
      'useSessionFormContext must be used within SessionFormProvider',
    );
  }
  return context;
};
