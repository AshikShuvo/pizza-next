import { useAuth } from './AuthContext';

export default function UserProfile() {
    const { user, authMethod, logout, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading profile...</span>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                        {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </span>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {user.name || 'User'}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Auth Method:</span>
                    <span className="text-sm text-gray-900 capitalize">
                        {authMethod === 'vipps' ? 'Vipps SSO' : authMethod === 'otp' ? 'OTP' : 'Unknown'}
                    </span>
                </div>
                
                <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">User ID:</span>
                    <span className="text-sm text-gray-900 font-mono">
                        {user.id}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Tenant:</span>
                    <span className="text-sm text-gray-900">
                        {user.tenantId}
                    </span>
                </div>
            </div>

            <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
                {isLoading ? 'Signing out...' : 'Sign Out'}
            </button>
        </div>
    );
}
