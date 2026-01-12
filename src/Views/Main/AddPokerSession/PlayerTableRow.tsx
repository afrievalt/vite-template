import React from 'react';

import type { SessionPlayerSelection } from '../types';

interface PlayerTableRowProps {
  player: SessionPlayerSelection;
  isCashOutMode: boolean;
  cashOutValue: number;
  totalBuyIns: number;
  onSeatNumberChange: (playerId: string, seatNumber: number) => void;
  onCashOutChange: (playerId: string, value: number) => void;
  onRebuyClick: (playerId: string) => void;
}

const cellClass = 'px-4 py-2 text-sm';
const inputClass =
  'w-20 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none';
const buttonClass =
  'rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none';

export const PlayerTableRow: React.FC<PlayerTableRowProps> = ({
  player,
  isCashOutMode,
  cashOutValue,
  totalBuyIns,
  onSeatNumberChange,
  onCashOutChange,
  onRebuyClick,
}) => {
  const handleSeatChange = (value: string) => {
    const seatNumber = Number.parseInt(value, 10);
    if (!Number.isNaN(seatNumber) && seatNumber > 0) {
      onSeatNumberChange(player.playerId, seatNumber);
    }
  };

  const handleCashOutInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number.parseFloat(event.target.value);
    onCashOutChange(player.playerId, Number.isNaN(value) ? 0 : value);
  };

  return (
    <tr>
      <td className={cellClass}>
        <input
          type="number"
          min="1"
          value={player.seatNumber}
          onChange={(event) => handleSeatChange(event.target.value)}
          className={inputClass}
        />
      </td>
      <td className={`${cellClass} text-gray-800`}>{player.name}</td>
      <td className={`${cellClass} text-gray-600`}>{player.description}</td>
      <td className={`${cellClass} text-right text-gray-800`}>
        ${totalBuyIns.toFixed(2)}
      </td>
      {isCashOutMode && (
        <td className={`${cellClass} text-right`}>
          <input
            type="number"
            min="0"
            step="0.01"
            value={cashOutValue}
            onChange={handleCashOutInputChange}
            className={inputClass}
          />
        </td>
      )}
      <td className={`${cellClass} text-right`}>
        <button
          type="button"
          onClick={() => onRebuyClick(player.playerId)}
          className={buttonClass}
        >
          Rebuy
        </button>
      </td>
    </tr>
  );
};
