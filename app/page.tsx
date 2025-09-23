import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto text-center p-8">
        <h1 className="text-5xl font-ringside-compressed-bold mb-6 text-gray-900">
          Welcome to Your App
        </h1>
        <p className="text-xl font-ringside-compressed-regular mb-8 text-gray-600">
          Your local Ringside fonts are now set up and ready to use.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/theme" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-ringside-compressed-medium px-8 py-3 rounded-lg transition-colors duration-200"
          >
            View Font Theme Examples
          </Link>
          
          <div className="text-sm text-gray-500 font-ringside-narrow-regular">
            <p>Available fonts: Ringside Compressed & Ringside Narrow</p>
            <p>Visit <code>/theme</code> to see all font examples and usage instructions</p>
          </div>
        </div>
      </div>
    </main>
  );
}
