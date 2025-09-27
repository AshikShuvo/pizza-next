'use client';

import { useEffect } from 'react';
import { useMsal } from '@/components/features/auth/hooks/useMsal';
import { apiClient } from '../apiClient';

export const useApiClient = () => {
  const { instance: msalInstance, isInitialized } = useMsal();

  useEffect(() => {
    if (msalInstance && isInitialized) {
      apiClient.setMsalInstance(msalInstance);
    }
  }, [msalInstance, isInitialized]);

  return apiClient;
};
