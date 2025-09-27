import { ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface AuthGuardProps {
    children: ReactNode;
    fallback?: ReactNode;
    requireAuth?: boolean;
}

export default function AuthGuard({ 
    children, 
    fallback, 
    requireAuth = true 
}: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Authentication Required
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Please sign in to access this page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    // If authentication is not required or user is authenticated, render children
    return <>{children}</>;
}
