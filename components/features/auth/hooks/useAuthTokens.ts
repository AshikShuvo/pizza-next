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
    } catch (error: unknown) {
      console.error('Token refresh error:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh token');
      
      // If silent token acquisition fails, clear the session
      if (error && typeof error === 'object' && 'errorCode' in error && error.errorCode === 'interaction_required') {
        setAccount(null);
        setAccessToken(null);
        setIdToken(null);
      }
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

        const accounts = msalInstance.getAllAccounts();
        if (accounts.length === 0) {
          setAccount(null);
          setAccessToken(null);
          setIdToken(null);
          return;
        }

        const account = accounts[0];
        setAccount(account);
        
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
