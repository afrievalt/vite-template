import React from 'react';

import { PlayersSection } from './PlayersSection';
import { SessionFormButtons } from './SessionFormButtons';
import { SessionFormFields } from './SessionFormFields';

export const SessionFormContent: React.FC = () => {
  return (
    <>
      <SessionFormFields />

      <PlayersSection />

      <SessionFormButtons />
    </>
  );
};
