import React from 'react';

import type { SessionRow } from '../../../store/selectors/sessionsSelectors';

interface SessionRowProps {
  session: SessionRow;
  onEditSession: (sessionId: string) => void;
  onRemoveSession: (sessionId: string) => void;
}

export const SessionRowItem: React.FC<SessionRowProps> = ({
  session,
  onEditSession,
  onRemoveSession,
}) => {
  return (
    <li className="rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-gray-800">
            {session.date} — {session.location}
          </span>
          <span className="text-sm text-gray-700">
            {session.game} — {session.stakes}
          </span>
          {session.players.length > 0 && (
            <div className="text-sm text-gray-700">
              Players:{' '}
              {session.players.map((player, index) => (
                <span key={player.id}>
                  {player.name} (${player.amount.toFixed(2)})
                  {index < session.players.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEditSession(session.id)}
            className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onRemoveSession(session.id)}
            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
};
