import React from 'react';

import { SelectedPlayersTable } from './SelectedPlayersTable';
import { useSessionFormContext } from './SessionFormContext';

export const PlayersSection: React.FC = () => {
  const {
    selectedPlayers,
    sessionId,
    isCashOutMode,
    cashOutValues,
    onSeatNumberChange,
    onCashOutChange,
    onCashOutClick,
  } = useSessionFormContext();
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Session Players</h3>
        <span className="text-sm text-gray-500">
          {selectedPlayers.length} selected
        </span>
      </div>
      <SelectedPlayersTable
        players={selectedPlayers}
        sessionId={sessionId}
        onSeatNumberChange={onSeatNumberChange}
        isCashOutMode={isCashOutMode}
        cashOutValues={cashOutValues}
        onCashOutChange={onCashOutChange}
      />
      {!isCashOutMode && (
        <button
          type="button"
          onClick={onCashOutClick}
          className="w-full rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
        >
          Cash Out
        </button>
      )}
    </div>
  );
};
