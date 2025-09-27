'use client';

import { useAuthContext as useAuth } from '@/components/features/auth';
import { Link } from '@/i18n/navigation';

export default function HomePage() {
  const { isAuthenticated, isLoading, user, authMethod, openAuthModal } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-8">
        <h1 className="text-5xl font-ringside-compressed-bold mb-6 text-gray-900">
          Welcome to Your App
        </h1>
        
        {isAuthenticated ? (
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                Welcome back, {user?.name || 'User'}!
              </h2>
              <p className="text-green-700">
                You&apos;re signed in via {authMethod === 'vipps' ? 'Vipps SSO' : authMethod === 'otp' ? 'OTP' : 'Authentication'}
              </p>
            </div>
            
            <div className="space-y-4">
              <Link 
                href="/profile" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-ringside-compressed-medium px-8 py-3 rounded-lg transition-colors duration-200 mr-4"
              >
                View Profile
              </Link>
              
              <Link 
                href="/auth-test" 
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-ringside-compressed-medium px-8 py-3 rounded-lg transition-colors duration-200"
              >
                Test Authentication
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-xl font-ringside-compressed-regular mb-8 text-gray-600">
              Please sign in to access your account and features.
            </p>
            
            <button
              onClick={openAuthModal}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-ringside-compressed-medium px-8 py-3 rounded-lg transition-colors duration-200"
            >
              Sign In
            </button>
          </div>
        )}
        
        <div className="space-y-4">
          <Link 
            href="/theme" 
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-ringside-compressed-medium px-8 py-3 rounded-lg transition-colors duration-200"
          >
            View Font Theme Examples
          </Link>
          
          <div className="text-sm text-gray-500 font-ringside-narrow-regular">
            <p>Available fonts: Ringside Compressed & Ringside Narrow</p>
            <p>Visit <code>/theme</code> to see all font examples and usage instructions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
