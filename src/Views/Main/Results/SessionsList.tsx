import React, { useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectSessionRows } from '../../../store/selectors/sessionsSelectors';
import {
  importStore as importStoreAction,
  removeSession,
} from '../../../store/slices/sessionsSlice';
import { store } from '../../../store/store';
import { syncStoreWithFirebase } from '../../../utils/firebaseSync';
import { exportStore, importStore } from '../../../utils/sessionImportExport';

import { SessionRowItem } from './SessionRow';
import { SessionsListHeader } from './SessionsListHeader';

interface SessionsListProps {
  onEditSession: (sessionId: string) => void;
}

const handleExport = () => {
  exportStore(store.getState());
};

export const SessionsList: React.FC<SessionsListProps> = ({
  onEditSession,
}) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rows = useAppSelector(selectSessionRows);

  const handleRemoveSession = (sessionId: string) => {
    dispatch(removeSession(sessionId));
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const importResult = await importStore(file);
    if (importResult) {
      dispatch(importStoreAction(importResult));
      void syncStoreWithFirebase(store.getState());
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (rows.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <SessionsListHeader
          onExport={handleExport}
          onImportClick={handleImportClick}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
        />
        <p className="text-gray-500">No sessions yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <SessionsListHeader
        onExport={handleExport}
        onImportClick={handleImportClick}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
      />
      <ul className="space-y-2">
        {rows.map((session) => (
          <SessionRowItem
            key={session.id}
            session={session}
            onEditSession={onEditSession}
            onRemoveSession={handleRemoveSession}
          />
        ))}
      </ul>
    </div>
  );
};
