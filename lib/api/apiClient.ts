import { PublicClientApplication } from '@azure/msal-browser';
import { tokenRequest } from '@/lib/auth/msalConfig';
import { getApiBaseUrl, getDefaultHeaders, getApiConfig, validateApiConfig, logApiConfig } from './config';

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

// Main API Client class
export class ApiClient {
  private config: ApiClientConfig;
  private msalInstance: PublicClientApplication | null = null;
  private loadingManager: LoadingManager;
  private currentAccessToken: string | null = null;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...config,
    };
    this.loadingManager = new LoadingManager();
  }

  // Set MSAL instance (called from React hook)
  setMsalInstance(instance: PublicClientApplication) {
    this.msalInstance = instance;
  }

  // Set current access token (called from React hook)
  setCurrentAccessToken(token: string | null) {
    this.currentAccessToken = token;
  }

  // Validate if current token is still valid
  private isTokenValid(token: string | null): boolean {
    if (!token) return false;
    
    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const bufferTime = 300; // 5 minutes buffer
      
      return payload.exp && (payload.exp - bufferTime) > currentTime;
    } catch (error) {
      console.warn('Failed to validate token:', error);
      return false;
    }
  }

  // Get loading manager for external access
  getLoadingManager() {
    return this.loadingManager;
  }

  // Main request method with MSAL token handling
  async request<T = unknown>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.config.timeout,
      retries = this.config.retries,
      requireAuth = true,
      signal,
    } = config;

    const requestId = this.generateRequestId();
    const url = `${this.config.baseURL}${endpoint}`;

    try {
      // Start loading
      this.loadingManager.startRequest(requestId, endpoint);

      // Get token if authentication is required
      let accessToken: string | null = null;
      if (requireAuth) {
        // First try to use the current access token from the hook if it's valid
        if (this.currentAccessToken && this.isTokenValid(this.currentAccessToken)) {
          accessToken = this.currentAccessToken;
          console.log('Using current valid access token from hook');
        } else if (this.msalInstance) {
          // Fallback to MSAL if no current token or token is invalid
          console.log('Getting fresh token from MSAL');
          accessToken = await this.getAccessTokenFromMsal();
        }
      }

      // Prepare request headers (merge default headers with request headers)
      const requestHeaders: Record<string, string> = {
        ...this.config.defaultHeaders,
        ...headers,
      };

      if (accessToken) {
        requestHeaders.Authorization = `Bearer ${accessToken}`;
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
      const response = await this.executeWithRetry(
        () => this.fetchWithTimeout(url, requestOptions, timeout!),
        retries!
      );

      const responseData = await this.parseResponse(response);

      if (!response.ok) {
        // Handle 401 - token might be expired, try to refresh
        if (response.status === 401 && requireAuth) {
          console.log('Received 401, attempting token refresh...');
          
          // Try to refresh using MSAL
          const refreshedToken = await this.refreshTokenFromMsal();
          if (refreshedToken) {
            // Update current token
            this.currentAccessToken = refreshedToken;
            
            // Retry request with new token
            requestHeaders.Authorization = `Bearer ${refreshedToken}`;
            const retryResponse = await this.fetchWithTimeout(url, {
              ...requestOptions,
              headers: requestHeaders,
            }, timeout!);
            
            if (retryResponse.ok) {
              const retryData = await this.parseResponse(retryResponse);
              return this.createSuccessResponse<T>(retryData as T, retryResponse);
            }
          } else {
            console.warn('Token refresh failed, request will fail with 401');
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

      return this.createSuccessResponse<T>(responseData as T, response);
    } catch (error) {
      throw this.handleRequestError(error);
    } finally {
      this.loadingManager.endRequest(requestId);
    }
  }

  // Get access token from MSAL
  private async getAccessTokenFromMsal(): Promise<string | null> {
    if (!this.msalInstance) {
      console.warn('MSAL instance not available');
      return null;
    }

    try {
      // Check if MSAL is properly initialized
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        console.warn('No MSAL accounts found');
        return null;
      }

      const account = accounts[0];
      
      // Add a small delay to ensure MSAL is fully initialized
      // This prevents endpoints_resolution_error
      await new Promise(resolve => setTimeout(resolve, 200));

      const request = {
        ...tokenRequest,
        account: account,
        scopes: tokenRequest.scopes.filter((scope): scope is string => scope !== undefined),
      };

      console.log('Attempting to acquire token silently...');
      const response = await this.msalInstance.acquireTokenSilent(request);
      console.log('Token acquired successfully');
      
      // Update the current access token
      this.currentAccessToken = response.accessToken;
      
      return response.accessToken;
    } catch (error) {
      console.error('Failed to get access token from MSAL:', error);
      
      // Handle specific MSAL errors
      if (error && typeof error === 'object' && 'errorCode' in error) {
        const errorCode = error.errorCode as string;
        
        if (errorCode === 'endpoints_resolution_error') {
          console.warn('MSAL endpoints resolution error - instance may not be fully initialized');
          return null;
        }
        
        if (errorCode === 'interaction_required') {
          console.warn('User interaction required for token acquisition');
          return null;
        }
        
        if (errorCode === 'consent_required') {
          console.warn('Consent required for token acquisition');
          return null;
        }
      }
      
      return null;
    }
  }

  // Refresh token using MSAL
  private async refreshTokenFromMsal(): Promise<string | null> {
    if (!this.msalInstance) {
      console.warn('MSAL instance not available for token refresh');
      return null;
    }

    try {
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        console.warn('No MSAL accounts found for token refresh');
        return null;
      }

      const account = accounts[0];
      
      // Add a small delay to ensure MSAL is fully initialized
      await new Promise(resolve => setTimeout(resolve, 200));

      const request = {
        ...tokenRequest,
        account: account,
        scopes: tokenRequest.scopes.filter((scope): scope is string => scope !== undefined),
        forceRefresh: true, // Force refresh
      };

      console.log('Attempting to refresh token...');
      const response = await this.msalInstance.acquireTokenSilent(request);
      console.log('Token refreshed successfully');
      
      // Update the current access token
      this.currentAccessToken = response.accessToken;
      
      return response.accessToken;
    } catch (error) {
      console.error('Failed to refresh token from MSAL:', error);
      
      // Handle specific MSAL errors
      if (error && typeof error === 'object' && 'errorCode' in error) {
        const errorCode = error.errorCode as string;
        
        if (errorCode === 'endpoints_resolution_error') {
          console.warn('MSAL endpoints resolution error during token refresh');
          return null;
        }
        
        if (errorCode === 'interaction_required') {
          console.warn('User interaction required for token refresh');
          return null;
        }
        
        if (errorCode === 'consent_required') {
          console.warn('Consent required for token refresh');
          return null;
        }
      }
      
      return null;
    }
  }

  // Fetch with timeout
  private async fetchWithTimeout(
    url: string, 
    options: RequestInit, 
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: this.combineSignals(options.signal, controller.signal),
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Retry logic with exponential backoff
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retries: number
  ): Promise<T> {
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
          const delay = this.config.retryDelay! * Math.pow(2, attempt);
          await this.delay(delay);
        }
      }
    }

    throw lastError || new Error('Request failed after all retries');
  }

  // Helper methods
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async parseResponse(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    
    if (contentType?.includes('text/')) {
      return response.text();
    }
    
    return response.blob();
  }

  private createSuccessResponse<T>(data: T, response: Response): ApiResponse<T> {
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      success: true,
    };
  }

  private handleRequestError(error: unknown): Error {
    if (error instanceof ApiError) {
      return error;
    }
    
    if (error instanceof Error) {
      return error;
    }
    
    return new Error('Unknown request error');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private combineSignals(...signals: (AbortSignal | undefined | null)[]): AbortSignal | undefined {
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
  }

  // Convenience methods
  async get<T = unknown>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = unknown>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method'>) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T = unknown>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method'>) {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T = unknown>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method'>) {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T = unknown>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Loading state access
  getLoadingState() {
    return this.loadingManager.getState();
  }
}

// Get API configuration from environment
const apiConfig = getApiConfig();

// Validate configuration
const validation = validateApiConfig(apiConfig);
if (!validation.isValid) {
  console.warn('⚠️ API Configuration Issues:', validation.errors);
}

// Log configuration in development
logApiConfig(apiConfig);

// Create default instance with environment-based configuration
export const apiClient = new ApiClient({
  baseURL: apiConfig.baseURL || getApiBaseUrl(),
  timeout: apiConfig.timeout || 10000,
  retries: apiConfig.retries || 3,
  retryDelay: apiConfig.retryDelay || 1000,
  defaultHeaders: getDefaultHeaders(apiConfig.apiVersion),
});
