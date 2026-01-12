import type { Result } from '../store/slices/resultsSlice';
import type { Session } from '../store/slices/sessionsSlice';
import type { RootState } from '../store/store';

export interface SessionExportData {
  sessions: Session[];
  results: Result[];
  exportDate: string;
  version: string;
}

export interface StoreExportData {
  state: RootState;
  exportDate: string;
  version: string;
}

const EXPORT_VERSION = '2.0.0';

export const exportStore = (state: RootState): void => {
  const exportData: StoreExportData = {
    state,
    exportDate: new Date().toISOString(),
    version: EXPORT_VERSION,
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `store-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export interface ImportResult {
  state: RootState;
  isFullStore: boolean;
}

const validateFullStoreState = (state: RootState): boolean => {
  return !!(
    state.sessions &&
    state.results &&
    state.buyIns &&
    state.players &&
    state.counter
  );
};

const parseFullStore = (data: StoreExportData): ImportResult => {
  if (!validateFullStoreState(data.state)) {
    return { state: data.state, isFullStore: false };
  }
  return { state: data.state, isFullStore: true };
};

const parseLegacyFormat = (data: SessionExportData): ImportResult => {
  if (!Array.isArray(data.sessions) || !Array.isArray(data.results)) {
    return {
      state: {
        sessions: { sessions: [] },
        results: { results: [] },
        buyIns: { buyIns: [] },
        players: { players: [] },
        counter: { value: 0 },
      } as RootState,
      isFullStore: false,
    };
  }
  return {
    state: {
      sessions: { sessions: data.sessions },
      results: { results: data.results },
      buyIns: { buyIns: [] },
      players: { players: [] },
      counter: { value: 0 },
    } as RootState,
    isFullStore: false,
  };
};

export const importStore = async (file: File): Promise<ImportResult | null> => {
  const text = await file.text();
  const parsed = JSON.parse(text) as StoreExportData | SessionExportData;

  if ('state' in parsed && parsed.state) {
    return parseFullStore(parsed as StoreExportData);
  }

  if ('sessions' in parsed && 'results' in parsed) {
    return parseLegacyFormat(parsed as SessionExportData);
  }

  return null;
};
