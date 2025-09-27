'use client';

import { useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '@/lib/auth/msalConfig';

// Singleton MSAL instance
let msalInstance: PublicClientApplication | null = null;
let isInitializing = false;

export const useMsal = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [instance, setInstance] = useState<PublicClientApplication | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const initializeMsal = async () => {
      // If already initializing, wait for it to complete
      if (isInitializing) {
        const checkInitialization = () => {
          if (msalInstance && isInitialized) {
            setInstance(msalInstance);
            setIsInitialized(true);
          } else {
            setTimeout(checkInitialization, 100);
          }
        };
        checkInitialization();
        return;
      }

      // If already initialized, just set the instance
      if (msalInstance) {
        setInstance(msalInstance);
        setIsInitialized(true);
        return;
      }

      isInitializing = true;

      try {
        msalInstance = new PublicClientApplication(msalConfig);
        await msalInstance.initialize();
        
        // Store it globally to prevent multiple instances
        if (typeof window !== 'undefined') {
          (window as unknown as { msalInstance: PublicClientApplication }).msalInstance = msalInstance;
        }
        
        // Handle redirect promise to process authentication responses
        const redirectResponse = await msalInstance.handleRedirectPromise();
        if (redirectResponse) {
          console.log('Redirect response received:', redirectResponse);
        }
        
        setInstance(msalInstance);
        setIsInitialized(true);
      } catch (error) {
        console.error('MSAL initialization error:', error);
      } finally {
        isInitializing = false;
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
