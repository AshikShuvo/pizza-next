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
}

export const useAuthTokens = (): UseAuthTokensReturn => {
  const { instance: msalInstance, isInitialized: isMsalInitialized } = useMsal();
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshToken = useCallback(async () => {
    if (!msalInstance || !isMsalInitialized) return;

    try {
      setIsLoading(true);
      setError(null);

      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        setAccount(null);
        setAccessToken(null);
        setIdToken(null);
        return;
      }

      const account = accounts[0];
      const request = {
        ...tokenRequest,
        account: account,
      };

      const response: AuthenticationResult = await msalInstance.acquireTokenSilent(request);
      
      setAccount(response.account);
      setAccessToken(response.accessToken);
      setIdToken(response.idToken);
      
      // Clear the stored auth data flag after successful token refresh
      // This allows future token refreshes to work normally
      localStorage.removeItem('auth_authenticated');
    } catch (error: unknown) {
      console.error('Token refresh error:', error);
      
      // Handle specific MSAL errors
      if (error && typeof error === 'object' && 'errorCode' in error) {
        const errorCode = error.errorCode as string;
        
        if (errorCode === 'endpoints_resolution_error') {
          console.warn('Endpoints resolution error - MSAL instance may not be fully initialized');
          setError('Authentication system is initializing. Please try again in a moment.');
          return; // Don't clear the session for this error
        }
        
        if (errorCode === 'interaction_required') {
          setAccount(null);
          setAccessToken(null);
          setIdToken(null);
          setError('Please sign in again');
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

        // Check if we have stored auth data (from recent login)
        // If so, don't try to refresh tokens at all to avoid endpoints_resolution_error
        const hasStoredAuthData = localStorage.getItem('auth_authenticated') === 'true';
        
        if (hasStoredAuthData) {
          console.log('Skipping token initialization due to recent login with stored auth data');
          setIsLoading(false);
          return;
        }
        
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length === 0) {
          setAccount(null);
          setAccessToken(null);
          setIdToken(null);
          return;
        }

        const account = accounts[0];
        setAccount(account);
        
        // Add a small delay to ensure MSAL is fully initialized
        // This prevents endpoints_resolution_error immediately after login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try to get fresh tokens
        await refreshToken();
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

  return {
    account,
    accessToken,
    idToken,
    isLoading,
    error,
    refreshToken,
  };
};
