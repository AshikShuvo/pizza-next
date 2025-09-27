'use client';

import { useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '@/lib/auth/msalConfig';

// Singleton MSAL instance
let msalInstance: PublicClientApplication | null = null;

export const useMsal = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [instance, setInstance] = useState<PublicClientApplication | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const initializeMsal = async () => {
      if (!msalInstance) {
        msalInstance = new PublicClientApplication(msalConfig);
      }

      try {
        await msalInstance.initialize();
        
        // Handle redirect promise to process authentication responses
        const redirectResponse = await msalInstance.handleRedirectPromise();
        if (redirectResponse) {
          console.log('Redirect response received:', redirectResponse);
        }
        
        setInstance(msalInstance);
        setIsInitialized(true);
      } catch (error) {
        console.error('MSAL initialization error:', error);
      }
    };

    initializeMsal();
  }, []);

  return { instance, isInitialized };
};

// Helper to get the global MSAL instance
export const getMsalInstance = (): PublicClientApplication | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
  }

  return msalInstance;
};
