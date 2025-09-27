'use client';

import { useState, useCallback } from 'react';
import { ApiError } from '../apiClient';

interface ApiErrorState {
  error: ApiError | null;
  hasError: boolean;
}

export const useApiError = () => {
  const [errorState, setErrorState] = useState<ApiErrorState>({
    error: null,
    hasError: false,
  });

  const setError = useCallback((error: ApiError | Error | null) => {
    if (error instanceof ApiError) {
      setErrorState({
        error,
        hasError: true,
      });
    } else if (error instanceof Error) {
      setErrorState({
        error: new ApiError(0, 'Unknown Error', undefined, error.message),
        hasError: true,
      });
    } else {
      setErrorState({
        error: null,
        hasError: false,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false,
    });
  }, []);

  const getErrorMessage = useCallback(() => {
    if (!errorState.error) return null;
    
    // Handle specific error cases
    if (errorState.error.status === 401) {
      return 'Authentication required. Please sign in again.';
    }
    
    if (errorState.error.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    if (errorState.error.status === 404) {
      return 'The requested resource was not found.';
    }
    
    if (errorState.error.status >= 500) {
      return 'Server error. Please try again later.';
    }
    
    return errorState.error.message || 'An unexpected error occurred.';
  }, [errorState.error]);

  return {
    error: errorState.error,
    hasError: errorState.hasError,
    setError,
    clearError,
    getErrorMessage,
  };
};
