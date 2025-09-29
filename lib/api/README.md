# API Client Implementation

This directory contains the refactored API client implementation that addresses the authentication issues by using a shared MSAL instance from the auth context instead of creating new instances for each API call.

## Problem Solved

The original API client had the following issues:
1. **New MSAL instances**: Each API call was trying to initialize a new MSAL instance, which couldn't access credentials stored in local storage
2. **No shared context**: The API client wasn't using the existing MSAL instance from the auth context
3. **SSR complications**: Server-side rendering calls were trying to authenticate unnecessarily
4. **No token refresh**: 401 responses weren't handled with automatic token refresh

## Solution Overview

The new implementation provides:
1. **Hook-based API client** that accesses the shared MSAL instance from auth context
2. **SSR detection** to skip authentication for server-side calls
3. **Automatic token refresh** on 401 responses with retry logic
4. **Backward compatibility** with the existing API client

## Files Structure

```
lib/api/
├── apiClient.ts                    # Original API client (kept for backward compatibility)
├── hooks/
│   ├── useApiClient.ts            # New hook-based API client
│   └── useLegacyApiClient.ts      # Legacy wrapper for old API client
├── examples/
│   └── useApiClientExample.tsx    # Usage examples
└── README.md                      # This file
```

## New Hook-Based API Client

### Basic Usage

```tsx
import { useApiClient } from '@/lib/api/hooks/useApiClient';

function MyComponent() {
  const { get, post, put, delete: del, getLoadingState } = useApiClient();

  const fetchData = async () => {
    try {
      // This will automatically:
      // 1. Skip auth for SSR
      // 2. Include auth header if user is logged in
      // 3. Refresh token and retry on 401
      const response = await get('/api/data', {
        requireAuth: true, // This is the default
        timeout: 10000,
      });
      
      console.log(response.data);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  return (
    <button onClick={fetchData}>
      Fetch Data
    </button>
  );
}
```

### Key Features

#### 1. SSR Detection
```tsx
const { isSSR } = useApiClient();

// The API client automatically detects SSR and skips authentication
// No need to manually check for SSR in your components
```

#### 2. Automatic Authentication
```tsx
// Authenticated call (default)
const response = await get('/api/protected-data');

// Public call (no auth required)
const response = await get('/api/public-data', {
  requireAuth: false
});
```

#### 3. Automatic Token Refresh
```tsx
// If the API returns 401, the client will:
// 1. Automatically refresh the token using the auth context
// 2. Retry the request with the new token
// 3. Return the successful response or throw an error if refresh fails

const response = await get('/api/data'); // Handles 401 automatically
```

#### 4. Loading State Management
```tsx
const { getLoadingState } = useApiClient();

// Monitor loading state
useEffect(() => {
  const loadingState = getLoadingState();
  console.log('Active requests:', loadingState.totalActiveRequests);
  console.log('Global loading:', loadingState.global);
}, [getLoadingState]);
```

### API Methods

All HTTP methods are available with the same interface:

```tsx
const { get, post, put, patch, delete: del, request } = useApiClient();

// GET request
const data = await get('/api/data', { timeout: 5000 });

// POST request
const result = await post('/api/data', { name: 'New Item' }, {
  headers: { 'Custom-Header': 'value' }
});

// PUT request
const updated = await put('/api/data/123', { name: 'Updated Item' });

// PATCH request
const patched = await patch('/api/data/123', { name: 'Patched Item' });

// DELETE request
await del('/api/data/123');

// Custom request
const custom = await request('/api/custom', {
  method: 'POST',
  body: { data: 'value' },
  requireAuth: false,
  timeout: 15000,
  retries: 5
});
```

### Request Configuration

```tsx
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  requireAuth?: boolean;  // Default: true
  signal?: AbortSignal;
}
```

### Response Format

```tsx
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  success: boolean;
  error?: string;
}
```

## Auth Context Integration

The new API client integrates with the updated auth context:

```tsx
// AuthContext now exposes:
interface AuthContextType {
  // ... existing properties
  msalInstance: PublicClientApplication | null;
  accessToken: string | null;
  refreshToken: () => Promise<string | null>;
}
```

## Migration Guide

### From Old API Client

**Old way:**
```tsx
import { useApiClient } from '@/lib/api/hooks/useApiClient';

function MyComponent() {
  const { apiClient, isReady } = useApiClient();
  
  const fetchData = async () => {
    if (isReady) {
      const response = await apiClient.get('/api/data');
      console.log(response.data);
    }
  };
}
```

**New way:**
```tsx
import { useApiClient } from '@/lib/api/hooks/useApiClient';

function MyComponent() {
  const { get } = useApiClient();
  
  const fetchData = async () => {
    const response = await get('/api/data');
    console.log(response.data);
  };
}
```

### Backward Compatibility

The old API client is still available as `useLegacyApiClient`:

```tsx
import { useLegacyApiClient } from '@/lib/api/hooks/useLegacyApiClient';

// This maintains the old API for existing code
const { apiClient, isReady } = useLegacyApiClient();
```

## Benefits

1. **No more MSAL instance issues**: Uses shared instance from auth context
2. **Automatic SSR handling**: No need to manually check for SSR
3. **Automatic token refresh**: Handles 401 responses transparently
4. **Better error handling**: Comprehensive error handling with retry logic
5. **Loading state management**: Built-in loading state tracking
6. **Type safety**: Full TypeScript support with proper types
7. **Backward compatibility**: Existing code continues to work

## Example Component

See `lib/api/examples/useApiClientExample.tsx` for a complete example showing all features.

## Configuration

The API client uses the same configuration as the original client. See `lib/api/config.ts` for configuration options.

## Error Handling

The API client provides comprehensive error handling:

- **Network errors**: Automatic retry with exponential backoff
- **401 errors**: Automatic token refresh and retry
- **4xx errors**: No retry, immediate error
- **5xx errors**: Retry with exponential backoff
- **Timeout errors**: Configurable timeout with abort signal support

All errors are wrapped in the `ApiError` class for consistent error handling.