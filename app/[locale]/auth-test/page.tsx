'use client';

import { useAuthContext as useAuth, UserProfile, AuthGuard } from '@/components/features/auth';

export default function AuthTestPage() {
  const { isAuthenticated, isLoading, user, authMethod, error } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Authentication Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Auth Method:</strong> {authMethod || 'None'}</p>
            <p><strong>User:</strong> {user?.name || 'Not logged in'}</p>
            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
            {error && (
              <p className="text-red-600"><strong>Error:</strong> {error}</p>
            )}
          </div>
        </div>

        {/* User Profile */}
        <AuthGuard requireAuth={true}>
          <UserProfile />
        </AuthGuard>
      </div>

      {/* Debug Information */}
      <div className="mt-8 bg-gray-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
        <pre className="text-sm text-gray-700 overflow-auto">
          {JSON.stringify({ isAuthenticated, isLoading, user, authMethod, error }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
