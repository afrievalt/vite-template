import { MainCard } from '@components/MainCard';
import { useAppSelector } from '@store/hooks';
import { selectSessionRows } from '@store/selectors/sessionsSelectors';
import type { SessionRow } from '@store/selectors/sessionsSelectors';
import React, { useMemo, useState } from 'react';

const GameFilter: React.FC<{
  selectedGame: string;
  onGameChange: (game: string) => void;
  games: string[];
}> = ({ selectedGame, onGameChange, games }) => (
  <MainCard>
    <label
      htmlFor="game-filter"
      className="mb-2 block text-sm font-medium text-gray-700"
    >
      Filter by Game
    </label>
    <select
      id="game-filter"
      value={selectedGame}
      onChange={(e) => onGameChange(e.target.value)}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    >
      {games.map((game) => (
        <option key={game} value={game}>
          {game}
        </option>
      ))}
    </select>
  </MainCard>
);

const ReportSummary: React.FC<{ profit: number; count: number }> = ({
  profit,
  count,
}) => (
  <MainCard>
    <div className="flex items-center justify-between">
      <span className="text-lg font-medium text-gray-700">
        Total Profit/Loss:
      </span>
      <span
        className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}
      >
        ${profit.toFixed(2)}
      </span>
    </div>
    <div className="mt-2 text-sm text-gray-500">{count} sessions filtered</div>
  </MainCard>
);

const ReportSessionRow: React.FC<{
  session: SessionRow;
  mePlayerId?: string;
}> = ({ session, mePlayerId }) => {
  const meResult = mePlayerId
    ? session.players.find((p) => p.id === mePlayerId)
    : null;
  return (
    <MainCard className="mb-0 sm:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-gray-800">{session.date}</span>
        <span className="text-sm text-gray-500">{session.game}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{session.location}</span>
        <span className="text-sm font-medium text-gray-700">
          {session.stakes}
        </span>
      </div>
      {meResult && (
        <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
          <span className="text-sm font-medium text-gray-600">
            Your Result:
          </span>
          <span
            className={`text-sm font-bold ${meResult.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            ${meResult.amount.toFixed(2)}
          </span>
        </div>
      )}
    </MainCard>
  );
};

export const Reports: React.FC = () => {
  const rows = useAppSelector(selectSessionRows);
  const players = useAppSelector((state) => state.players.players);
  const [selectedGame, setSelectedGame] = useState<string>('All');

  const games = useMemo(
    () => ['All', ...new Set(rows.map((row) => row.game))],
    [rows],
  );
  const mePlayer = useMemo(
    () => players.find((p) => p.description === 'ME'),
    [players],
  );

  const filteredRows = useMemo(() => {
    return selectedGame === 'All'
      ? rows
      : rows.filter((row) => row.game === selectedGame);
  }, [rows, selectedGame]);

  const meTotalProfit = useMemo(() => {
    if (!mePlayer) return 0;
    return filteredRows.reduce((total, row) => {
      return (
        total + (row.players.find((p) => p.id === mePlayer.id)?.amount ?? 0)
      );
    }, 0);
  }, [filteredRows, mePlayer]);

  return (
    <div className="pb-8">
      <div className="mx-auto max-w-2xl px-0 sm:px-4">
        <h1 className="mb-6 px-4 text-2xl font-bold text-gray-800 sm:px-0">
          Reports
        </h1>
        <GameFilter
          games={games}
          selectedGame={selectedGame}
          onGameChange={setSelectedGame}
        />
        <ReportSummary count={filteredRows.length} profit={meTotalProfit} />
        <div className="space-y-4">
          {filteredRows.map((session) => (
            <ReportSessionRow
              key={session.id}
              mePlayerId={mePlayer?.id}
              session={session}
            />
          ))}
          {filteredRows.length === 0 && (
            <MainCard className="text-center text-gray-500">
              No sessions match the filter
            </MainCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
