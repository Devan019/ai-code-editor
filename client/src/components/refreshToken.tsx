
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function SessionRefresher() {
  const { data: session, update } = useSession();

  useEffect(() => {
    if (!session) return;

    // Check if token is expired or about to expire
    const checkToken = () => {
      if (session.expiresAt && Date.now() > session.expiresAt - 60000) {
        update();
      }
    };

    // Check immediately
    checkToken();

    // Set up interval to check every 30 seconds
    const interval = setInterval(checkToken, 30000);

    return () => clearInterval(interval);
  }, [session, update]);

  return null;
}