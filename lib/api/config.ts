/**
 * API Client Configuration Utilities
 * 
 * This file provides utilities for configuring the API client
 * with environment variables and custom settings.
 */

export interface ApiConfigOptions {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  apiVersion?: string;
  customHeaders?: Record<string, string>;
}

/**
 * Get API configuration from environment variables
 */
export const getApiConfig = (): ApiConfigOptions => {
  return {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: process.env.NEXT_PUBLIC_API_TIMEOUT 
      ? parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT, 10) 
      : undefined,
    retries: process.env.NEXT_PUBLIC_API_RETRIES 
      ? parseInt(process.env.NEXT_PUBLIC_API_RETRIES, 10) 
      : undefined,
    retryDelay: process.env.NEXT_PUBLIC_API_RETRY_DELAY 
      ? parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY, 10) 
      : undefined,
    apiVersion: process.env.NEXT_PUBLIC_API_VERSION,
  };
};

/**
 * Get default headers configuration
 */
export const getDefaultHeaders = (apiVersion?: string): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(apiVersion && {
      'API-Version': apiVersion,
    }),
  };
};

/**
 * Validate API configuration
 */
export const validateApiConfig = (config: ApiConfigOptions): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.baseURL) {
    errors.push('API base URL is required. Set NEXT_PUBLIC_API_BASE_URL environment variable.');
  }

  if (config.timeout && (config.timeout < 1000 || config.timeout > 60000)) {
    errors.push('API timeout should be between 1000ms and 60000ms.');
  }

  if (config.retries && (config.retries < 0 || config.retries > 10)) {
    errors.push('API retries should be between 0 and 10.');
  }

  if (config.retryDelay && (config.retryDelay < 100 || config.retryDelay > 10000)) {
    errors.push('API retry delay should be between 100ms and 10000ms.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get environment-specific API base URL
 */
export const getApiBaseUrl = (): string => {
  // Check for environment variable first
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Fallback to localhost for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/api';
  }
  
  // Production fallback
  return '/api';
};

/**
 * Log API configuration (for debugging)
 */
export const logApiConfig = (config: ApiConfigOptions): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 API Client Configuration:', {
      baseURL: config.baseURL,
      timeout: config.timeout,
      retries: config.retries,
      retryDelay: config.retryDelay,
      apiVersion: config.apiVersion,
    });
  }
};
