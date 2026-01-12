import { useEffect, useRef } from 'react';

import type { SessionDetails } from '../Views/Main/types';

export const useSessionDetailsSync = (
  date: string,
  location: string,
  game: string,
  stakes: string,
  onDetailsChange: (details: SessionDetails) => void,
): void => {
  const prevValuesRef = useRef<SessionDetails | null>(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    const currentDetails: SessionDetails = { date, location, game, stakes };
    const prevDetails = prevValuesRef.current;

    if (
      isFirstRenderRef.current ||
      !prevDetails ||
      prevDetails.date !== currentDetails.date ||
      prevDetails.location !== currentDetails.location ||
      prevDetails.game !== currentDetails.game ||
      prevDetails.stakes !== currentDetails.stakes
    ) {
      prevValuesRef.current = currentDetails;
      if (!isFirstRenderRef.current) {
        onDetailsChange(currentDetails);
      }
      isFirstRenderRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, location, game, stakes]);
};
