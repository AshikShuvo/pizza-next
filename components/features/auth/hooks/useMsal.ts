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
          // Store auth data for immediate use
          localStorage.setItem('auth_authenticated', 'true');
          localStorage.setItem('access_token', redirectResponse.accessToken);
          localStorage.setItem('id_token', redirectResponse.idToken);
          
          // Store user profile data
          if (redirectResponse.account) {
            const userProfile = {
              id: redirectResponse.account.homeAccountId,
              username: redirectResponse.account.username,
              name: redirectResponse.account.name || redirectResponse.account.username,
              email: redirectResponse.account.username,
              tenantId: redirectResponse.account.tenantId,
              homeAccountId: redirectResponse.account.homeAccountId,
              environment: redirectResponse.account.environment,
            };
            localStorage.setItem('auth_user', JSON.stringify(userProfile));
            
            // Determine auth method based on account
            const authMethod = redirectResponse.account.username?.includes('@') ? 'otp' : 'vipps';
            localStorage.setItem('auth_method', authMethod);
          }
        }
        
        setInstance(msalInstance);
        setIsInitialized(true);
      } catch (error) {
        console.error('MSAL initialization error:', error);
        // Reset initialization state on error
        isInitializing = false;
      } finally {
        isInitializing = false;
      }
    };

    initializeMsal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
