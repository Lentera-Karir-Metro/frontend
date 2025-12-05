'use client';

import { useEffect } from 'react';
import { setupAutoLogoutChecker } from '@/lib/auth';

/**
 * Component untuk auto-check token expiry
 * Akan otomatis logout user jika token expired
 */
export default function AuthChecker() {
  useEffect(() => {
    // Setup interval checker untuk token expiry
    const intervalId = setupAutoLogoutChecker();

    // Cleanup interval saat component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return null; // Component ini tidak render apapun
}
