'use client';

import { useState, useEffect } from 'react';
import { SynroUser, getStoredUser, setStoredUser, logoutOperator } from './auth-state';

export function useSynroAuth() {
  const [user, setUser] = useState<SynroUser>(getStoredUser());

  useEffect(() => {
    // Initial fetch on mount
    setUser(getStoredUser());

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<SynroUser | null>;
      setUser(customEvent.detail || getStoredUser());
    };

    window.addEventListener('synro-auth-change', handleAuthChange);
    window.addEventListener('storage', () => {
      setUser(getStoredUser());
    });

    return () => {
      window.removeEventListener('synro-auth-change', handleAuthChange);
    };
  }, []);

  return {
    user,
    setUser: (u: SynroUser | null) => setStoredUser(u),
    logout: logoutOperator,
  };
}
