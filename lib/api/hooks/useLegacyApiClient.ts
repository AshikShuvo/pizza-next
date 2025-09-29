'use client';

import { useEffect, useState } from 'react';
import { useMsal } from '@/components/features/auth/hooks/useMsal';
import { useAuthTokens } from '@/components/features/auth/hooks/useAuthTokens';
import { apiClient } from '../apiClient';

// Legacy useApiClient hook for backward compatibility
// This maintains the old API while the new hook-based approach is adopted
export const useLegacyApiClient = () => {
  const { instance: msalInstance, isInitialized } = useMsal();
  const { accessToken, isLoading: isTokenLoading, error: tokenError } = useAuthTokens();
  const [isApiClientReady, setIsApiClientReady] = useState(false);

  useEffect(() => {
    if (msalInstance && isInitialized) {
      // Add a small delay to ensure MSAL is fully ready
      const timer = setTimeout(() => {
        apiClient.setMsalInstance(msalInstance);
        setIsApiClientReady(true);
        console.log('API Client initialized with MSAL');
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setIsApiClientReady(false);
    }
  }, [msalInstance, isInitialized]);

  // Set the current access token in the API client
  useEffect(() => {
    if (accessToken) {
      apiClient.setCurrentAccessToken(accessToken);
    }
  }, [accessToken]);

  return {
    apiClient,
    isReady: isApiClientReady && !isTokenLoading,
    accessToken,
    tokenError,
  };
};
