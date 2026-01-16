/* eslint-disable max-lines-per-function */
import React from 'react';

import type { SessionPlayerSelection } from './types';

interface SelectedPlayersTableProps {
  players: SessionPlayerSelection[];
  onAmountChange: (playerId: string, amount: string) => void;
  onRebuy: (playerId: string, buyInAmount: number) => void;
  onSeatNumberChange: (playerId: string, seatNumber: number) => void;
  onRemove: (playerId: string) => void;
}

const headerClass =
  'px-4 py-2 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase';
const inputClass =
  'w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none';
const actionButtonClass =
  'rounded-md px-3 py-1 text-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

export const SelectedPlayersTable: React.FC<SelectedPlayersTableProps> = ({
  players,
  onAmountChange,
  onRebuy,
  onSeatNumberChange,
  onRemove,
}) => {
  const handleAmountInput = (playerId: string, value: string) => {
    onAmountChange(playerId, value);
  };

  const handleSeatInput = (playerId: string, value: string) => {
    const seatNumber = Number.parseInt(value, 10);
    if (Number.isNaN(seatNumber) || seatNumber < 1) {
      return;
    }
    onSeatNumberChange(playerId, seatNumber);
  };

  if (players.length === 0) {
    return <p className="text-sm text-gray-500">No players selected.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className={headerClass}>Seat</th>
            <th className={headerClass}>Name</th>
            <th className={headerClass}>Chips</th>
            <th className={headerClass}>Buy In</th>
            <th className={headerClass}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {players.map((player) => (
            <tr key={player.playerId}>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min="1"
                  value={player.seatNumber}
                  onChange={(event) =>
                    handleSeatInput(player.playerId, event.target.value)
                  }
                  className={inputClass}
                />
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">{player.name}</td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={player.amount}
                  onChange={(event) =>
                    handleAmountInput(player.playerId, event.target.value)
                  }
                  className={inputClass}
                />
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">
                ${player.buyInAmount.toFixed(2)}
              </td>
              <td className="space-x-2 px-4 py-2">
                <button
                  type="button"
                  onClick={() => onRebuy(player.playerId, player.buyInAmount)}
                  className={`${actionButtonClass} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`}
                >
                  Rebuy
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(player.playerId)}
                  className={`${actionButtonClass} bg-red-600 hover:bg-red-700 focus:ring-red-500`}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
