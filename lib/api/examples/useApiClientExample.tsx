'use client';

import React, { useState, useEffect } from 'react';
import { useApiClient } from '../hooks/useApiClient';

// Example component showing how to use the new hook-based API client
export const ApiClientExample: React.FC = () => {
  const { get, post, put, delete: del, getLoadingState, isSSR, isAuthenticated, accessToken } = useApiClient();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Example: GET request (will automatically include auth header if user is logged in)
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // This will automatically:
      // 1. Skip auth for SSR
      // 2. Include auth header if user is logged in
      // 3. Refresh token and retry on 401
      const response = await get('/api/data', {
        requireAuth: true, // This is the default
        timeout: 10000,
      });
      
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Example: POST request with body
  const createData = async (newData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await post('/api/data', newData, {
        requireAuth: true,
        headers: {
          'Custom-Header': 'value',
        },
      });
      
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Example: PUT request
  const updateData = async (id: string, updatedData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await put(`/api/data/${id}`, updatedData, {
        requireAuth: true,
      });
      
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Example: DELETE request
  const deleteData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await del(`/api/data/${id}`, {
        requireAuth: true,
      });
      
      // Refresh data after deletion
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Example: Public API call (no auth required)
  const fetchPublicData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await get('/api/public/data', {
        requireAuth: false, // Explicitly disable auth
      });
      
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Monitor loading state
  useEffect(() => {
    const loadingState = getLoadingState();
    console.log('Loading state:', loadingState);
  }, [getLoadingState]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Client Example</h1>
      
      {/* Status Information */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Status</h2>
        <p>SSR Mode: {isSSR ? 'Yes' : 'No'}</p>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>Access Token: {accessToken ? 'Available' : 'Not available'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 space-x-4">
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Fetch Data (Auth Required)
        </button>
        
        <button
          onClick={fetchPublicData}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Fetch Public Data
        </button>
        
        <button
          onClick={() => createData({ name: 'New Item', value: 123 })}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Create Data
        </button>
      </div>

      {/* Data Display */}
      {data && (
        <div className="mb-6 p-4 bg-white border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Response Data</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How it works:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>SSR Detection:</strong> Automatically skips authentication for server-side rendering</li>
          <li><strong>Auth Context Integration:</strong> Uses shared MSAL instance from auth context</li>
          <li><strong>Automatic Token Refresh:</strong> Refreshes token and retries on 401 responses</li>
          <li><strong>Loading Management:</strong> Tracks loading state across all requests</li>
          <li><strong>Error Handling:</strong> Comprehensive error handling with retry logic</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiClientExample;
