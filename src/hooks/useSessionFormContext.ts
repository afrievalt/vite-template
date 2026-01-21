import { useContext } from 'react';

import { SessionFormContext } from '../Views/Main/AddPokerSession/SessionFormContext';
import type { SessionFormContextValue } from '../Views/Main/types';

export const useSessionFormContext = (): SessionFormContextValue => {
  const context = useContext(SessionFormContext);
  if (!context) {
    throw new Error(
      'useSessionFormContext must be used within SessionFormProvider',
    );
  }
  return context;
};
