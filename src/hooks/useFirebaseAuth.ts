import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from '../utils/firebaseAuth';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const content = initializing
    ? 'Checking auth...'
    : user
      ? user.displayName || user.email || 'Signed in'
      : 'Not signed in';

  return { user, initializing, content };
};
