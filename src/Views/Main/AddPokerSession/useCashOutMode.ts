import { useState } from 'react';

import type { SessionPlayerSelection } from '../types';

interface CashOutValues {
  [playerId: string]: number;
}

interface UseCashOutModeResult {
  isCashOutMode: boolean;
  cashOutValues: CashOutValues;
  handleCashOutClick: (players: SessionPlayerSelection[]) => void;
  handleCashOutChange: (playerId: string, value: number) => void;
}

export const useCashOutMode = (): UseCashOutModeResult => {
  const [isCashOutMode, setIsCashOutMode] = useState(false);
  const [cashOutValues, setCashOutValues] = useState<CashOutValues>({});

  const handleCashOutClick = (players: SessionPlayerSelection[]) => {
    setIsCashOutMode(true);
    const initialValues: CashOutValues = {};
    players.forEach((player) => {
      initialValues[player.playerId] = 0;
    });
    setCashOutValues(initialValues);
  };

  const handleCashOutChange = (playerId: string, value: number) => {
    setCashOutValues((prev) => ({
      ...prev,
      [playerId]: Math.max(0, value),
    }));
  };

  return {
    isCashOutMode,
    cashOutValues,
    handleCashOutClick,
    handleCashOutChange,
  };
};
