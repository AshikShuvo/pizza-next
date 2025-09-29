'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../apiClient';

export const useApiLoading = () => {
  const [loadingState, setLoadingState] = useState(apiClient.getLoadingState());

  useEffect(() => {
    const unsubscribe = apiClient.getLoadingManager().subscribe(() => {
      setLoadingState(apiClient.getLoadingState());
    });

    return unsubscribe;
  }, []);

  return {
    isLoading: loadingState.global,
    totalActiveRequests: loadingState.totalActiveRequests,
    isEndpointLoading: (endpoint: string) => {
      return Array.from(loadingState.requests.values()).some(
        req => req.endpoint === endpoint
      );
    },
  };
};
