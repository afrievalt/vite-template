import React from 'react';

interface SessionsListHeaderProps {
  onExport: () => void;
  onImportClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SessionsListHeader: React.FC<SessionsListHeaderProps> = ({
  onExport,
  onImportClick,
  fileInputRef,
  onFileChange,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-xl font-bold text-gray-800">Saved Sessions</h3>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onExport}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          Export
        </button>
        <button
          type="button"
          onClick={onImportClick}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
        >
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
