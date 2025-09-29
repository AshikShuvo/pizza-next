'use client';

import { useApiClient, ApiResponse } from '@/lib/api/hooks/useApiClient';
import { useState } from 'react';

export default function ApiTestPage() {
  const { get, post, getLoadingState, isSSR, isAuthenticated, accessToken, refreshToken } = useApiClient();
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<ApiResponse | null>(null);
  
  const loadingState = getLoadingState();
  const isLoading = loadingState.global;

  const clearError = () => setError(null);

  const testApiCall = async () => {
    try {
      clearError();
      console.log('Testing API call...');
      
      // Test a simple GET request
      const response = await get('/products/categories-v2', {
        requireAuth: false, // Test without authentication first
        timeout: 5000,
      });
      
      console.log('API Response:', response);
      setLastResponse(response);
      alert(`API call successful! Status: ${response.status}`);
    } catch (error) {
      console.error('API Error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testAuthenticatedCall = async () => {
    try {
      clearError();
      
      if (!isAuthenticated) {
        alert('You need to be authenticated to test this call. Please sign in first.');
        return;
      }
      
      console.log('Testing authenticated API call...');
      
      // Test an authenticated request
      const response = await get('/products/categories-v2', {
        requireAuth: true,
        timeout: 5000,
      });
      
      console.log('Authenticated API Response:', response);
      setLastResponse(response);
      alert(`Authenticated API call successful! Status: ${response.status}`);
    } catch (error) {
      console.error('Authenticated API Error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testPostCall = async () => {
    try {
      clearError();
      console.log('Testing POST API call...');
      
      // Test a POST request
      const response = await post('/products/categories-v2', {
        message: 'Hello from API client!',
        timestamp: new Date().toISOString(),
      }, {
        requireAuth: false,
        timeout: 5000,
      });
      
      console.log('POST API Response:', response);
      setLastResponse(response);
      alert(`POST API call successful! Status: ${response.status}`);
    } catch (error) {
      console.error('POST API Error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testTokenRefresh = async () => {
    try {
      clearError();
      console.log('Testing token refresh scenario...');
      
      // This will test the automatic token refresh on 401
      const response = await get('/products/categories-v2', {
        requireAuth: true,
        timeout: 5000,
      });
      
      console.log('Token refresh test response:', response);
      setLastResponse(response);
      alert(`Token refresh test successful! Status: ${response.status}`);
    } catch (error) {
      console.error('Token refresh test error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const refreshTokenTest = async () => {
    try {
      clearError();
      
      if (!isAuthenticated) {
        alert('You need to be authenticated to test token refresh. Please sign in first.');
        return;
      }
      
      const newToken = await refreshToken();
      alert(`Token refresh: ${newToken ? 'Success - Token available' : 'Failed - No token'}`);
    } catch (error) {
      console.error('Token refresh error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          API Client Test Page
        </h1>
        
        {/* API Client Status */}
        <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${!isSSR ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-800">
                  API Client Status: {isSSR ? 'SSR Mode' : 'Client Mode'}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {isSSR ? 'Server-side rendering detected' : 'Client-side rendering'}
              </span>
            </div>
            
            {/* Authentication Status */}
            <div className="text-sm text-gray-600">
              <div className="flex items-center">
                <span className="mr-2">Authentication:</span>
                {isAuthenticated ? (
                  <span className="text-green-600">Authenticated</span>
                ) : (
                  <span className="text-red-600">Not authenticated</span>
                )}
              </div>
              <div className="flex items-center">
                <span className="mr-2">Access Token:</span>
                {accessToken ? (
                  <span className="text-green-600 font-mono text-xs">
                    {accessToken.substring(0, 20)}...
                  </span>
                ) : (
                  <span className="text-red-600">Not available</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Global Loading State */}
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800">
                API requests in progress... ({loadingState.totalActiveRequests} active requests)
              </span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
                <p className="text-red-700">{error}</p>
              </div>
              <button 
                onClick={clearError}
                className="ml-4 px-3 py-1 bg-red-200 hover:bg-red-300 text-red-800 rounded text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Debug Information */}
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <h3 className="text-yellow-800 font-semibold mb-2">Debug Information:</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>isSSR:</strong> {isSSR ? 'Yes' : 'No'}</p>
            <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>hasAccessToken:</strong> {accessToken ? 'Yes' : 'No'}</p>
            <p><strong>Access Token Length:</strong> {accessToken ? accessToken.length : 'N/A'}</p>
            <p><strong>Loading State:</strong> {isLoading ? 'Loading' : 'Not Loading'}</p>
            <p><strong>Active Requests:</strong> {loadingState.totalActiveRequests}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-yellow-800 font-medium">View Full Auth State</summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-40">
                {JSON.stringify({
                  isSSR,
                  isAuthenticated,
                  hasAccessToken: !!accessToken,
                  accessTokenLength: accessToken?.length || 0,
                  isLoading,
                  loadingState: loadingState.totalActiveRequests
                }, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Last Response Display */}
        {lastResponse && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
            <h3 className="text-green-800 font-semibold mb-2">Last Response:</h3>
            <div className="text-sm text-green-700">
              <p><strong>Status:</strong> {lastResponse.status} {lastResponse.statusText}</p>
              <p><strong>Success:</strong> {lastResponse.success ? 'Yes' : 'No'}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-green-800 font-medium">View Response Data</summary>
                <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(lastResponse.data, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        {/* Test Buttons */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Client Tests</h2>
            
            <div className="space-y-3">
              <button
                onClick={testApiCall}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  isLoading
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isLoading ? 'Testing...' : 'Test Basic API Call (GET /products/categories-v2)'}
              </button>

              <button
                onClick={testAuthenticatedCall}
                disabled={isLoading || !isAuthenticated}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  isLoading || !isAuthenticated
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isLoading 
                  ? 'Testing...' 
                  : !isAuthenticated
                    ? 'Please Sign In First'
                    : 'Test Authenticated Call (GET /products/categories-v2)'
                }
              </button>

              <button
                onClick={testPostCall}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  isLoading
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {isLoading ? 'Testing...' : 'Test POST Call (POST /products/categories-v2)'}
              </button>

              <button
                onClick={testTokenRefresh}
                disabled={isLoading || !isAuthenticated}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  isLoading || !isAuthenticated
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {isLoading 
                  ? 'Testing...' 
                  : !isAuthenticated
                    ? 'Please Sign In First'
                    : 'Test Token Refresh (GET with auth)'
                }
              </button>

              <button
                onClick={refreshTokenTest}
                disabled={isLoading || !isAuthenticated}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  isLoading || !isAuthenticated
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}
              >
                {isLoading 
                  ? 'Testing...' 
                  : !isAuthenticated
                    ? 'Please Sign In First'
                    : 'Test Manual Token Refresh'
                }
              </button>
            </div>
          </div>

          {/* API Client Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Client Configuration</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'}</p>
              <p><strong>Timeout:</strong> {process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'}ms</p>
              <p><strong>Retries:</strong> {process.env.NEXT_PUBLIC_API_RETRIES || '3'} attempts</p>
              <p><strong>Retry Delay:</strong> {process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000'}ms</p>
              <p><strong>API Version:</strong> {process.env.NEXT_PUBLIC_API_VERSION || 'Not set'}</p>
              <p><strong>Authentication:</strong> MSAL integration enabled</p>
              <p><strong>Default Headers:</strong> Content-Type, Accept, X-Requested-With</p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Client Features</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. <strong>Basic API Call:</strong> Tests a simple GET request without authentication</p>
              <p>2. <strong>Authenticated Call:</strong> Tests a GET request with automatic MSAL token authentication</p>
              <p>3. <strong>POST Call:</strong> Tests a POST request with JSON payload</p>
              <p>4. <strong>Token Refresh Test:</strong> Tests automatic token refresh on 401 responses</p>
              <p>5. <strong>Manual Token Refresh:</strong> Tests manual token refresh functionality</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Key Features:</h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>SSR Detection:</strong> Automatically skips auth for server-side rendering</li>
                  <li>• <strong>MSAL Integration:</strong> Uses auth context for token management</li>
                  <li>• <strong>Automatic Token Refresh:</strong> Handles 401 responses with token refresh and retry</li>
                  <li>• <strong>Hook-based:</strong> Direct access to API methods without setup</li>
                  <li>• <strong>Loading Management:</strong> Built-in loading state tracking</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Note: Make sure your API server is running and accessible at the configured base URL.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
