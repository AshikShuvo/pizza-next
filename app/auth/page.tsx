'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait a moment for the page to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if there are URL parameters indicating successful authentication
        const urlParams = new URLSearchParams(window.location.search);
        const hash = window.location.hash;
        
        if (urlParams.get('code') || hash.includes('access_token') || hash.includes('id_token')) {
          setStatus('success');
          // Redirect to home page with locale detection
          setTimeout(() => {
            // Try to detect locale from localStorage or default to 'en'
            const savedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
            router.push(`/${savedLocale}`);
          }, 2000);
        } else {
          setStatus('error');
          // Redirect to home page after error
          setTimeout(() => {
            const savedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
            router.push(`/${savedLocale}`);
          }, 3000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setTimeout(() => {
          const savedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
          router.push(`/${savedLocale}`);
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (status === 'processing') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Processing Authentication...
          </h2>
          <p className="text-gray-600">
            Please wait while we complete your sign-in.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Authentication Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            You have been successfully signed in. Redirecting to home page...
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting in 2 seconds...
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-600 mb-4">
            There was an error during authentication. Please try again.
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting to home page in 3 seconds...
          </div>
        </div>
      </div>
    );
  }

  return null;
}