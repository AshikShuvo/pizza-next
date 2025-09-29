'use client';

import { useState, useEffect, useCallback } from 'react';
import { AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { useMsal } from './useMsal';
import { tokenRequest } from '@/lib/auth/msalConfig';

interface UseAuthTokensReturn {
  account: AccountInfo | null;
  accessToken: string | null;
  idToken: string | null;
  isLoading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
  syncTokensFromStorage: () => void;
}

export const useAuthTokens = (): UseAuthTokensReturn => {
  const { instance: msalInstance, isInitialized: isMsalInitialized } = useMsal();
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshToken = useCallback(async () => {
    if (!msalInstance || !isMsalInitialized) {
      console.log('Cannot refresh token: MSAL not ready');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('Starting token refresh...');
      
      // First check if we have stored tokens from redirect
      const storedAccessToken = localStorage.getItem('access_token');
      const storedIdToken = localStorage.getItem('id_token');
      if (storedAccessToken && storedIdToken) {
        console.log('Found stored tokens from redirect, using them');
        setAccessToken(storedAccessToken);
        setIdToken(storedIdToken);
        
        // Get account info from stored data
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
        
        setIsLoading(false);
        return;
      }
      
      const accounts = msalInstance.getAllAccounts();
      console.log('Accounts available for token refresh:', accounts.length);
      
      if (accounts.length === 0) {
        console.log('No accounts available, clearing tokens');
        setAccount(null);
        setAccessToken(null);
        setIdToken(null);
        return;
      }

      const account = accounts[0];
      console.log('Using account for token refresh:', account.username);
      
      // Add a small delay to ensure MSAL is fully ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const request = {
        ...tokenRequest,
        account: account,
        scopes: tokenRequest.scopes.filter((scope): scope is string => scope !== undefined),
      };

      console.log('Making acquireTokenSilent request...');
      const response: AuthenticationResult = await msalInstance.acquireTokenSilent(request);
      
      console.log('Token refresh successful!');
      console.log('Access token length:', response.accessToken.length);
      
      setAccount(response.account);
      setAccessToken(response.accessToken);
      setIdToken(response.idToken);
      
      // Store the refreshed tokens
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('id_token', response.idToken);
      
      // Clear the stored auth data flag after successful token refresh
      // This allows future token refreshes to work normally
      localStorage.removeItem('auth_authenticated');
    } catch (error: unknown) {
      console.error('Token refresh error:', error);
      
      // Handle specific MSAL errors
      if (error && typeof error === 'object' && 'errorCode' in error) {
        const errorCode = error.errorCode as string;
        console.log('MSAL error code:', errorCode);
        
        if (errorCode === 'endpoints_resolution_error') {
          console.warn('Endpoints resolution error - MSAL instance may not be fully initialized');
          setError('Authentication system is initializing. Please try again in a moment.');
          return; // Don't clear the session for this error
        }
        
        if (errorCode === 'interaction_required') {
          console.warn('User interaction required for token refresh');
          setAccount(null);
          setAccessToken(null);
          setIdToken(null);
          setError('Please sign in again');
          return;
        }
        
        if (errorCode === 'consent_required') {
          console.warn('Consent required for token refresh');
          setError('Please sign in again to grant required permissions');
          return;
        }
      }
      
      setError(error instanceof Error ? error.message : 'Failed to refresh token');
    } finally {
      setIsLoading(false);
    }
  }, [msalInstance, isMsalInitialized]);

  // Initialize tokens on mount
  useEffect(() => {
    if (!msalInstance || !isMsalInitialized) {
      setIsLoading(false);
      return;
    }

    const initializeTokens = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Starting token initialization...');
        console.log('MSAL instance available:', !!msalInstance);
        console.log('MSAL initialized:', isMsalInitialized);

        // Check if we have stored auth data (from recent login)
        // If so, wait longer before trying to get tokens to avoid endpoints_resolution_error
        const hasStoredAuthData = localStorage.getItem('auth_authenticated') === 'true';
        
        if (hasStoredAuthData) {
          console.log('Found stored auth data, checking for stored tokens...');
          
          // Check if we have stored tokens from redirect response
          const storedAccessToken = localStorage.getItem('access_token');
          const storedIdToken = localStorage.getItem('id_token');
          
          if (storedAccessToken) {
            console.log('Found stored access token from redirect response');
            setAccessToken(storedAccessToken);
          }
          
          if (storedIdToken) {
            console.log('Found stored ID token from redirect response');
            setIdToken(storedIdToken);
          }
          
          // Wait longer to ensure MSAL is fully ready after recent login
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        const accounts = msalInstance.getAllAccounts();
        console.log('MSAL accounts found:', accounts.length);
        
        if (accounts.length === 0) {
          console.log('No MSAL accounts found, clearing tokens');
          setAccount(null);
          setAccessToken(null);
          setIdToken(null);
          return;
        }

        const account = accounts[0];
        console.log('Using account:', account.username);
        setAccount(account);
        
        // If we have stored tokens, use them instead of refreshing
        if (hasStoredAuthData && localStorage.getItem('access_token')) {
          console.log('Using stored tokens instead of refreshing');
          const storedAccessToken = localStorage.getItem('access_token');
          const storedIdToken = localStorage.getItem('id_token');
          
          if (storedAccessToken) {
            setAccessToken(storedAccessToken);
          }
          if (storedIdToken) {
            setIdToken(storedIdToken);
          }
        } else {
          // Add a small delay to ensure MSAL is fully initialized
          // This prevents endpoints_resolution_error immediately after login
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Try to get fresh tokens
          console.log('Attempting to refresh tokens...');
          await refreshToken();
        }
      } catch (error: unknown) {
        console.error('Token initialization error:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize tokens');
        setAccount(null);
        setAccessToken(null);
        setIdToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTokens();
  }, [msalInstance, isMsalInitialized, refreshToken]);

  // Listen for localStorage changes to update tokens
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' && e.newValue) {
        console.log('Access token updated in localStorage, updating state');
        setAccessToken(e.newValue);
      }
      if (e.key === 'id_token' && e.newValue) {
        console.log('ID token updated in localStorage, updating state');
        setIdToken(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check localStorage on mount and whenever tokens change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStoredTokens = () => {
      const storedAccessToken = localStorage.getItem('access_token');
      const storedIdToken = localStorage.getItem('id_token');
      
      if (storedAccessToken && storedAccessToken !== accessToken) {
        setAccessToken(storedAccessToken);
      }
      
      if (storedIdToken && storedIdToken !== idToken) {
        setIdToken(storedIdToken);
      }
    };

    // Check immediately
    checkStoredTokens();

    // Also check periodically in case tokens were stored after component mount
    // Reduced frequency for production
    const interval = setInterval(checkStoredTokens, 5000);
    
    return () => clearInterval(interval);
  }, [accessToken, idToken]);

  // Force token synchronization from localStorage
  const syncTokensFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const storedAccessToken = localStorage.getItem('access_token');
    const storedIdToken = localStorage.getItem('id_token');
    
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    
    if (storedIdToken) {
      setIdToken(storedIdToken);
    }
  }, []);

  return {
    account,
    accessToken,
    idToken,
    isLoading,
    error,
    refreshToken,
    syncTokensFromStorage,
  };
};
