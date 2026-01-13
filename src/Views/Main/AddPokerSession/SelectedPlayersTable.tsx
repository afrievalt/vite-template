import React, { useMemo, useState } from 'react';

import { useAppSelector } from '../../../store/hooks';
import { selectTotalBuyInsByPlayerAndSession } from '../../../store/selectors/buyinsSelectors';
import type { SessionPlayerSelection } from '../types';

import { PlayerTableRow } from './PlayerTableRow';
import { RebuyDialog } from './RebuyDialog';

interface SelectedPlayersTableProps {
  players: SessionPlayerSelection[];
  sessionId: string | null;
  onSeatNumberChange: (playerId: string, seatNumber: number) => void;
  isCashOutMode: boolean;
  cashOutValues: Record<string, number>;
  onCashOutChange: (playerId: string, value: number) => void;
}

const headerClass =
  'px-4 py-2 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase';

export const SelectedPlayersTable: React.FC<SelectedPlayersTableProps> = ({
  players,
  sessionId,
  onSeatNumberChange,
  isCashOutMode,
  cashOutValues,
  onCashOutChange,
}) => {
  const [dialogPlayerId, setDialogPlayerId] = useState<string | null>(null);
  const buyInsBySession = useAppSelector(selectTotalBuyInsByPlayerAndSession);
  const totalBuyInsMap = useMemo(() => {
    if (!sessionId) {
      return {};
    }
    return buyInsBySession[sessionId] ?? {};
  }, [buyInsBySession, sessionId]);

  if (players.length === 0) {
    return <p className="text-sm text-gray-500">No players selected.</p>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {isCashOutMode ? (
                <>
                  <th className={`${headerClass} text-right`}>Cash Out</th>
                  <th className={headerClass}>Name</th>
                  <th className={`${headerClass} text-right`}>Total Buyins</th>
                </>
              ) : (
                <>
                  <th className={headerClass}></th>
                  <th className={headerClass}>Seat Number</th>
                  <th className={headerClass}>Name</th>
                  <th className={`${headerClass} text-right`}>Total Buyins</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {players.map((player) => (
              <PlayerTableRow
                key={player.playerId}
                player={player}
                isCashOutMode={isCashOutMode}
                cashOutValue={cashOutValues[player.playerId] ?? 0}
                totalBuyIns={totalBuyInsMap[player.playerId] ?? 0}
                onSeatNumberChange={onSeatNumberChange}
                onCashOutChange={onCashOutChange}
                onRebuyClick={setDialogPlayerId}
              />
            ))}
          </tbody>
        </table>
      </div>
      {dialogPlayerId && (
        <RebuyDialog
          isOpen={true}
          playerId={dialogPlayerId}
          sessionId={sessionId}
          onClose={() => setDialogPlayerId(null)}
        />
      )}
    </>
  );
};
