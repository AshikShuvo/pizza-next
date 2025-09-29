'use client';

import { useCallback, useMemo } from 'react';
import { useAuth } from '@/components/features/auth/AuthContext';
import { getApiBaseUrl, getDefaultHeaders, getApiConfig, validateApiConfig, logApiConfig } from '../config';

// API Configuration
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  defaultHeaders?: Record<string, string>;
}

// Request configuration
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  requireAuth?: boolean;
  signal?: AbortSignal;
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  success: boolean;
  error?: string;
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public response?: Response,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

// Loading state interface
export interface LoadingState {
  global: boolean;
  requests: Map<string, { endpoint: string; startTime: number }>;
  totalActiveRequests: number;
}

// Loading Manager class
class LoadingManager {
  private state: LoadingState = {
    global: false,
    requests: new Map(),
    totalActiveRequests: 0,
  };

  private listeners: Set<() => void> = new Set();

  startRequest(requestId: string, endpoint: string) {
    this.state.requests.set(requestId, {
      endpoint,
      startTime: Date.now(),
    });
    this.state.totalActiveRequests = this.state.requests.size;
    this.state.global = this.state.totalActiveRequests > 0;
    this.notifyListeners();
  }

  endRequest(requestId: string) {
    this.state.requests.delete(requestId);
    this.state.totalActiveRequests = this.state.requests.size;
    this.state.global = this.state.totalActiveRequests > 0;
    this.notifyListeners();
  }

  getState(): LoadingState {
    return { ...this.state };
  }

  isEndpointLoading(endpoint: string): boolean {
    return Array.from(this.state.requests.values()).some(
      req => req.endpoint === endpoint
    );
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

// Hook-based API Client
export const useApiClient = (config?: Partial<ApiClientConfig>) => {
  const { accessToken, refreshToken, isAuthenticated, syncTokensFromStorage } = useAuth();
  
  // Check if we're on the server side
  const isSSR = typeof window === 'undefined';
  
  // Create loading manager instance
  const loadingManager = useMemo(() => new LoadingManager(), []);

  // Get API configuration
  const apiConfig = useMemo(() => {
    const baseConfig = getApiConfig();
    return {
      baseURL: baseConfig.baseURL || getApiBaseUrl(),
      timeout: baseConfig.timeout || 10000,
      retries: baseConfig.retries || 3,
      retryDelay: baseConfig.retryDelay || 1000,
      defaultHeaders: getDefaultHeaders(baseConfig.apiVersion),
      ...config,
    };
  }, [config]);

  // Validate configuration
  useMemo(() => {
    const validation = validateApiConfig(apiConfig);
    if (!validation.isValid) {
      console.warn('⚠️ API Configuration Issues:', validation.errors);
    }
    logApiConfig(apiConfig);
  }, [apiConfig]);

  // Helper functions
  const generateRequestId = (): string => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const parseResponse = async (response: Response): Promise<unknown> => {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    
    if (contentType?.includes('text/')) {
      return response.text();
    }
    
    return response.blob();
  };

  const createSuccessResponse = <T>(data: T, response: Response): ApiResponse<T> => {
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      success: true,
    };
  };

  const handleRequestError = (error: unknown): Error => {
    if (error instanceof ApiError) {
      return error;
    }
    
    if (error instanceof Error) {
      return error;
    }
    
    return new Error('Unknown request error');
  };

  const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const combineSignals = (...signals: (AbortSignal | undefined | null)[]): AbortSignal | undefined => {
    const validSignals = signals.filter(Boolean) as AbortSignal[];
    if (validSignals.length === 0) return undefined;
    if (validSignals.length === 1) return validSignals[0];

    const controller = new AbortController();
    validSignals.forEach(signal => {
      if (signal.aborted) {
        controller.abort();
      } else {
        signal.addEventListener('abort', () => controller.abort());
      }
    });
    return controller.signal;
  };

  // Fetch with timeout
  const fetchWithTimeout = useCallback(async (
    url: string, 
    options: RequestInit, 
    timeout: number
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: combineSignals(options.signal, controller.signal),
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, []);

  // Retry logic with exponential backoff
  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    retries: number
  ): Promise<T> => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }

        // Wait before retry
        if (attempt < retries) {
          const delayMs = apiConfig.retryDelay! * Math.pow(2, attempt);
          await delay(delayMs);
        }
      }
    }

    throw lastError || new Error('Request failed after all retries');
  }, [apiConfig.retryDelay]);

  // Main request method with MSAL token handling
  const request = useCallback(async <T = unknown>(
    endpoint: string,
    requestConfig: RequestConfig = {}
  ): Promise<ApiResponse<T>> => {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = apiConfig.timeout,
      retries = apiConfig.retries,
      requireAuth = true,
      signal,
    } = requestConfig;

    const requestId = generateRequestId();
    const url = `${apiConfig.baseURL}${endpoint}`;

    try {
      // Start loading
      loadingManager.startRequest(requestId, endpoint);

      // Get token if authentication is required and not SSR
      let accessTokenToUse: string | null = null;
      if (requireAuth && !isSSR && isAuthenticated) {
        // Use the access token from auth context
        if (accessToken) {
          accessTokenToUse = accessToken;
        } else {
          console.warn('Authentication required but no access token available');
        }
      }

      // Prepare request headers (merge default headers with request headers)
      const requestHeaders: Record<string, string> = {
        ...apiConfig.defaultHeaders,
        ...headers,
      };

      if (accessTokenToUse) {
        requestHeaders.Authorization = `Bearer ${accessTokenToUse}`;
      }

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        signal,
      };

      if (body && method !== 'GET') {
        requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      // Execute request with retry logic
      const response = await executeWithRetry(
        () => fetchWithTimeout(url, requestOptions, timeout!),
        retries!
      );

      const responseData = await parseResponse(response);

      if (!response.ok) {
        // Handle 401 - token might be expired, try to refresh
        if (response.status === 401 && requireAuth && !isSSR && isAuthenticated) {
          // Try to refresh using auth context
          const refreshedToken = await refreshToken();
          if (refreshedToken) {
            // Retry request with new token
            requestHeaders.Authorization = `Bearer ${refreshedToken}`;
            const retryResponse = await fetchWithTimeout(url, {
              ...requestOptions,
              headers: requestHeaders,
            }, timeout!);
            
            if (retryResponse.ok) {
              const retryData = await parseResponse(retryResponse);
              return createSuccessResponse<T>(retryData as T, retryResponse);
            }
          }
        }

        throw new ApiError(
          response.status,
          response.statusText,
          response,
          (responseData as { message?: string; error?: string })?.message || 
          (responseData as { message?: string; error?: string })?.error
        );
      }

      return createSuccessResponse<T>(responseData as T, response);
    } catch (error) {
      throw handleRequestError(error);
    } finally {
      loadingManager.endRequest(requestId);
    }
  }, [accessToken, refreshToken, isAuthenticated, isSSR, apiConfig, loadingManager, executeWithRetry, fetchWithTimeout]);

  // Convenience methods
  const get = useCallback(<T = unknown>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) => {
    return request<T>(endpoint, { ...config, method: 'GET' });
  }, [request]);

  const post = useCallback(<T = unknown>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method'>) => {
    return request<T>(endpoint, { ...config, method: 'POST', body });
  }, [request]);

  const put = useCallback(<T = unknown>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method'>) => {
    return request<T>(endpoint, { ...config, method: 'PUT', body });
  }, [request]);

  const patch = useCallback(<T = unknown>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method'>) => {
    return request<T>(endpoint, { ...config, method: 'PATCH', body });
  }, [request]);

  const del = useCallback(<T = unknown>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) => {
    return request<T>(endpoint, { ...config, method: 'DELETE' });
  }, [request]);

  // Loading state access
  const getLoadingState = useCallback(() => {
    return loadingManager.getState();
  }, [loadingManager]);

  return {
    // Main request method
    request,
    
    // Convenience methods
    get,
    post,
    put,
    patch,
    delete: del,
    
    // State and utilities
    getLoadingState,
    isSSR,
    isAuthenticated,
    accessToken,
    refreshToken,
    syncTokensFromStorage,
  };
};