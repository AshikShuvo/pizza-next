export default function AuthOptions() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <h1 className="text-2xl font-semibold mb-6">Auth Options</h1>
            
            <button className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Carry on with Vipps
            </button>
            
            <button className="w-full max-w-xs bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                Continue with OTP
            </button>
        </div>
    );
}