// Main API client
export { apiClient, ApiClient, ApiError } from './apiClient';
export type { ApiClientConfig, RequestConfig, ApiResponse, LoadingState } from './apiClient';

// Configuration utilities
export { 
  getApiConfig, 
  getDefaultHeaders, 
  validateApiConfig, 
  getApiBaseUrl, 
  logApiConfig 
} from './config';
export type { ApiConfigOptions } from './config';

// React hooks
export { useApiClient, useApiLoading, useApiError } from './hooks';

// Example components (for reference)
export { default as UserProfileExample } from './examples/UserProfileExample';
export { default as DataListExample } from './examples/DataListExample';
