# Custom API Client with MSAL Integration

A comprehensive API client for Next.js 15 applications with Microsoft Authentication Library (MSAL) integration, automatic token management, loading states, and error handling.

## Features

- 🔐 **MSAL Integration**: Automatic token acquisition and refresh using MSAL
- 🔄 **Automatic Token Refresh**: Handles token expiration and refresh seamlessly
- ⏳ **Loading State Management**: Global and per-endpoint loading states
- 🚨 **Error Handling**: Comprehensive error handling with user-friendly messages
- 🔄 **Retry Logic**: Exponential backoff retry for failed requests
- ⏱️ **Request Timeout**: Configurable request timeouts
- 🎯 **TypeScript Support**: Full type safety with generics
- 📱 **React Hooks**: Easy-to-use React hooks for integration

## Installation

The API client is already integrated into your project. No additional installation required.

## Quick Start

### 1. Basic Usage in Client Components

```typescript
'use client';

import { useApiClient, useApiLoading, useApiError } from '@/lib/api/hooks';

export default function MyComponent() {
  const api = useApiClient();
  const { isLoading, isEndpointLoading } = useApiLoading();
  const { error, hasError, setError, clearError, getErrorMessage } = useApiError();

  const fetchData = async () => {
    try {
      clearError();
      const response = await api.get('/users/profile');
      console.log(response.data);
    } catch (error) {
      setError(error as Error);
    }
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {hasError && <div>Error: {getErrorMessage()}</div>}
      <button onClick={fetchData} disabled={isLoading}>
        Fetch Data
      </button>
    </div>
  );
}
```

### 2. API Methods

The API client provides convenient methods for all HTTP verbs:

```typescript
// GET request
const response = await api.get<UserProfile>('/users/profile');

// POST request
const response = await api.post<UserProfile>('/users', userData);

// PUT request
const response = await api.put<UserProfile>('/users/123', updateData);

// PATCH request
const response = await api.patch<UserProfile>('/users/123', partialData);

// DELETE request
const response = await api.delete('/users/123');
```

### 3. Advanced Configuration

```typescript
// Custom request configuration
const response = await api.request<UserProfile>('/users/profile', {
  method: 'GET',
  headers: {
    'Custom-Header': 'value',
  },
  timeout: 5000,
  retries: 2,
  requireAuth: true, // Default: true
  signal: abortController.signal,
});
```

## Configuration

### Environment Variables

Configure your API client using environment variables. Copy the variables from `env-variables.txt` to your `.env.local` file:

```env
# Required: API Base URL
NEXT_PUBLIC_API_BASE_URL="https://your-api-domain.com/api"

# Optional: API Configuration
NEXT_PUBLIC_API_TIMEOUT="10000"        # Timeout in milliseconds (default: 10000)
NEXT_PUBLIC_API_RETRIES="3"            # Number of retry attempts (default: 3)
NEXT_PUBLIC_API_RETRY_DELAY="1000"     # Retry delay in milliseconds (default: 1000)
NEXT_PUBLIC_API_VERSION="v1"           # API version header (optional)
```

### Default Configuration

The API client comes with sensible defaults:

- **Base URL**: `process.env.NEXT_PUBLIC_API_BASE_URL` or environment-specific fallback
- **Timeout**: 10 seconds (configurable via `NEXT_PUBLIC_API_TIMEOUT`)
- **Retries**: 3 attempts (configurable via `NEXT_PUBLIC_API_RETRIES`)
- **Retry Delay**: 1 second (configurable via `NEXT_PUBLIC_API_RETRY_DELAY`)
- **Authentication**: Required by default
- **Default Headers**: Content-Type, Accept, X-Requested-With, API-Version (if set)

### Environment-Specific Fallbacks

The API client automatically handles different environments:

- **Development**: Falls back to `http://localhost:3001/api` if no base URL is set
- **Production**: Falls back to `/api` if no base URL is set
- **Custom**: Uses `NEXT_PUBLIC_API_BASE_URL` if provided

### Configuration Utilities

The API client includes utilities for configuration management:

```typescript
import { getApiConfig, validateApiConfig, getDefaultHeaders } from '@/lib/api';

// Get current configuration
const config = getApiConfig();

// Validate configuration
const validation = validateApiConfig(config);
if (!validation.isValid) {
  console.warn('Configuration issues:', validation.errors);
}

// Get default headers
const headers = getDefaultHeaders('v1');
```

### Custom Configuration

You can also create custom API client instances:

```typescript
import { ApiClient } from '@/lib/api';

const customApiClient = new ApiClient({
  baseURL: 'https://custom-api.com/v2',
  timeout: 15000,
  retries: 5,
  retryDelay: 2000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value',
  },
});
```

## React Hooks

### `useApiClient()`

Returns the configured API client instance with MSAL integration.

```typescript
const api = useApiClient();
```

### `useApiLoading()`

Provides loading state management:

```typescript
const { isLoading, totalActiveRequests, isEndpointLoading } = useApiLoading();

// Check if any request is loading
if (isLoading) { /* show global loading */ }

// Check if specific endpoint is loading
if (isEndpointLoading('/users/profile')) { /* show specific loading */ }
```

### `useApiError()`

Handles error state management:

```typescript
const { error, hasError, setError, clearError, getErrorMessage } = useApiError();

// Set error
setError(error);

// Clear error
clearError();

// Get user-friendly error message
const message = getErrorMessage();
```

## Error Handling

The API client provides comprehensive error handling:

### Automatic Error Types

- **401 Unauthorized**: Automatically attempts token refresh
- **403 Forbidden**: User-friendly permission error
- **404 Not Found**: Resource not found error
- **5xx Server Errors**: Server error messages

### Custom Error Handling

```typescript
try {
  const response = await api.get('/users/profile');
  // Handle success
} catch (error) {
  if (error instanceof ApiError) {
    console.log('Status:', error.status);
    console.log('Message:', error.message);
  } else {
    console.log('Network or other error:', error);
  }
}
```

## Loading States

### Global Loading State

```typescript
const { isLoading } = useApiLoading();

// Show global loading indicator
{isLoading && <div>Loading...</div>}
```

### Per-Endpoint Loading State

```typescript
const { isEndpointLoading } = useApiLoading();

// Show specific loading for an endpoint
{isEndpointLoading('/users/profile') && <div>Loading profile...</div>}
```

### Loading State in Buttons

```typescript
<button 
  disabled={isLoading || isEndpointLoading('/users/profile')}
  onClick={fetchProfile}
>
  {isEndpointLoading('/users/profile') ? 'Loading...' : 'Fetch Profile'}
</button>
```

## Token Management

The API client automatically handles token management through MSAL:

1. **Token Acquisition**: Automatically gets access tokens from MSAL
2. **Token Injection**: Adds `Authorization: Bearer <token>` header to requests
3. **Token Refresh**: Automatically refreshes tokens on 401 errors
4. **Token Caching**: Uses MSAL's built-in token cache

### Manual Token Refresh

If you need to manually refresh tokens:

```typescript
// The API client will automatically handle this, but you can also:
const { refreshToken } = useAuthTokens();
await refreshToken();
```

## Request Interceptors

The API client supports request and response interceptors:

```typescript
// Add custom headers to all requests
apiClient.addRequestInterceptor((config) => {
  config.headers['X-Custom-Header'] = 'value';
  return config;
});

// Handle responses globally
apiClient.addResponseInterceptor((response) => {
  console.log('Response received:', response);
  return response;
});
```

## Abort Controller Support

Cancel requests using AbortController:

```typescript
const controller = new AbortController();

// Cancel request after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  const response = await api.get('/users/profile', {
    signal: controller.signal,
  });
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled');
  }
}
```

## TypeScript Support

The API client is fully typed with TypeScript generics:

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// Type-safe API calls
const response = await api.get<UserProfile>('/users/profile');
// response.data is typed as UserProfile

const createResponse = await api.post<UserProfile>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});
// createResponse.data is typed as UserProfile
```

## Examples

See the example components in `lib/api/examples/`:

- **UserProfileExample.tsx**: Complete CRUD operations example
- **DataListExample.tsx**: List management with loading states

## Best Practices

1. **Always handle errors**: Use try-catch blocks and the error hooks
2. **Show loading states**: Provide user feedback during API calls
3. **Use TypeScript**: Define interfaces for your API responses
4. **Handle authentication**: The client handles this automatically, but be aware of 401 errors
5. **Clean up**: Cancel requests when components unmount using AbortController

## Troubleshooting

### Common Issues

1. **Token not found**: Ensure MSAL is properly initialized and user is authenticated
2. **401 errors**: Check if the API endpoint requires authentication
3. **CORS issues**: Ensure your API server allows requests from your domain
4. **Timeout errors**: Increase the timeout value for slow endpoints

### Debug Mode

Enable debug logging by setting the environment variable:

```env
NEXT_PUBLIC_API_DEBUG=true
```

This will log all API requests and responses to the console.

## API Reference

### ApiClient Class

- `get<T>(endpoint, config?)`: GET request
- `post<T>(endpoint, body?, config?)`: POST request
- `put<T>(endpoint, body?, config?)`: PUT request
- `patch<T>(endpoint, body?, config?)`: PATCH request
- `delete<T>(endpoint, config?)`: DELETE request
- `request<T>(endpoint, config)`: Generic request method

### RequestConfig Interface

```typescript
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  requireAuth?: boolean;
  signal?: AbortSignal;
}
```

### ApiResponse Interface

```typescript
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  success: boolean;
  error?: string;
}
```
