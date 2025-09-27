import { useAuth } from './AuthContext';

export default function AuthOptions() {
    const { loginWithVipps, loginWithOTP, isLoading, error, clearError } = useAuth();

    const handleVippsLogin = async () => {
        clearError();
        await loginWithVipps();
    };

    const handleOTPLogin = async () => {
        clearError();
        await loginWithOTP();
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <h1 className="text-2xl font-semibold mb-6">Auth Options</h1>
            
            {error && (
                <div className="w-full max-w-xs bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">{error}</span>
                        <button 
                            onClick={clearError}
                            className="ml-2 text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
            
            <button 
                onClick={handleVippsLogin}
                disabled={isLoading}
                className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
                {isLoading ? (
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Authenticating...
                    </div>
                ) : (
                    'Continue with Vipps'
                )}
            </button>
            
            <button 
                onClick={handleOTPLogin}
                disabled={isLoading}
                className="w-full max-w-xs bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
                {isLoading ? (
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Authenticating...
                    </div>
                ) : (
                    'Continue with OTP'
                )}
            </button>
        </div>
    );
}