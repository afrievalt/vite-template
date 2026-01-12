/* eslint-disable max-lines-per-function */
import React, { useEffect, useState } from 'react';

import type { Player } from '../../store/slices/playersSlice';

interface PlayersTableProps {
  players: Player[];
  onAdd: (player: Player, buyInAmount: number) => void;
}

export const PlayersTable: React.FC<PlayersTableProps> = ({
  players,
  onAdd,
}) => {
  const [buyInAmounts, setBuyInAmounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setBuyInAmounts((prev) => {
      const updated = { ...prev };
      players.forEach((player) => {
        if (!(player.id in updated)) {
          updated[player.id] = 97;
        }
      });
      return updated;
    });
  }, [players]);

  const handleBuyInChange = (playerId: string, value: string) => {
    const amount = Number.parseFloat(value);
    if (!Number.isNaN(amount) && amount >= 0) {
      setBuyInAmounts((prev) => ({ ...prev, [playerId]: amount }));
    }
  };

  const handleAdd = (player: Player) => {
    const buyInAmount = buyInAmounts[player.id] ?? 97;
    onAdd(player, buyInAmount);
  };

  if (players.length === 0) {
    return <p className="text-sm text-gray-500">No players added yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Description
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Buy In
            </th>
            <th className="px-4 py-2 text-right text-xs font-semibold tracking-wide text-gray-600 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {players.map((player) => (
            <tr key={player.id}>
              <td className="px-4 py-2 text-sm text-gray-800">{player.name}</td>
              <td className="px-4 py-2 text-sm text-gray-600">
                {player.description}
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={buyInAmounts[player.id] ?? 97}
                  onChange={(event) =>
                    handleBuyInChange(player.id, event.target.value)
                  }
                  className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  type="button"
                  onClick={() => handleAdd(player)}
                  className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Add
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
