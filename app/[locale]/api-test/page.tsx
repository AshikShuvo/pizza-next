'use client';

import { useApiClient, useApiLoading, useApiError } from '@/lib/api/hooks';

export default function ApiTestPage() {
  const api = useApiClient();
  const { isLoading, isEndpointLoading } = useApiLoading();
  const { error, hasError, setError, clearError, getErrorMessage } = useApiError();

  const testApiCall = async () => {
    try {
      clearError();
      console.log('Testing API call...');
      
      // Test a simple GET request
      const response = await api.get('/test', {
        requireAuth: false, // Test without authentication first
        timeout: 5000,
      });
      
      console.log('API Response:', response);
      alert(`API call successful! Status: ${response.status}`);
    } catch (error) {
      console.error('API Error:', error);
      setError(error as Error);
    }
  };

  const testAuthenticatedCall = async () => {
    try {
      clearError();
      console.log('Testing authenticated API call...');
      
      // Test an authenticated request
      const response = await api.get('/users/profile', {
        requireAuth: true,
        timeout: 5000,
      });
      
      console.log('Authenticated API Response:', response);
      alert(`Authenticated API call successful! Status: ${response.status}`);
    } catch (error) {
      console.error('Authenticated API Error:', error);
      setError(error as Error);
    }
  };

  const testPostCall = async () => {
    try {
      clearError();
      console.log('Testing POST API call...');
      
      // Test a POST request
      const response = await api.post('/test', {
        message: 'Hello from API client!',
        timestamp: new Date().toISOString(),
      }, {
        requireAuth: false,
        timeout: 5000,
      });
      
      console.log('POST API Response:', response);
      alert(`POST API call successful! Status: ${response.status}`);
    } catch (error) {
      console.error('POST API Error:', error);
      setError(error as Error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          API Client Test Page
        </h1>
        
        {/* Global Loading State */}
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800">
                API requests in progress... ({isLoading ? 'Active requests' : ''})
              </span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {hasError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
                <p className="text-red-700">{getErrorMessage()}</p>
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

        {/* Test Buttons */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Client Tests</h2>
            
            <div className="space-y-3">
              <button
                onClick={testApiCall}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  isEndpointLoading('/test')
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isEndpointLoading('/test') ? 'Testing...' : 'Test Basic API Call (GET /test)'}
              </button>

              <button
                onClick={testAuthenticatedCall}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  isEndpointLoading('/users/profile')
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isEndpointLoading('/users/profile') ? 'Testing...' : 'Test Authenticated Call (GET /users/profile)'}
              </button>

              <button
                onClick={testPostCall}
                disabled={isLoading}
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  isEndpointLoading('/test')
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                {isEndpointLoading('/test') ? 'Testing...' : 'Test POST Call (POST /test)'}
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
            <h2 className="text-xl font-semibold mb-4">Usage Instructions</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. <strong>Basic API Call:</strong> Tests a simple GET request without authentication</p>
              <p>2. <strong>Authenticated Call:</strong> Tests a GET request with MSAL token authentication</p>
              <p>3. <strong>POST Call:</strong> Tests a POST request with JSON payload</p>
              <p className="text-xs text-gray-500 mt-4">
                Note: Make sure your API server is running and accessible at the configured base URL.
                Check the browser console for detailed request/response logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
