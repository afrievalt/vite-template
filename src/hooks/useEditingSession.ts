import { useAppSelector } from '@store/hooks';

export const useEditingSession = (editingSessionId: string | null) => {
  const sessions = useAppSelector((state) => state.sessions.sessions);
  const editingSession = editingSessionId
    ? sessions.find((s) => s.id === editingSessionId)
    : null;

  return editingSession;
};
