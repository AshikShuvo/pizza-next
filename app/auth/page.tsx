'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '@/lib/auth/msalConfig';
import { 
  determineAuthMethod, 
  storeAuthMethod, 
  getStoredAuthMethod,
  extractUserProfile
} from '@/lib/auth/authUtils';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('processing');
        
        // Initialize MSAL instance (reuse existing if available)
        let instance: PublicClientApplication;
        
        // Check if there's already a global MSAL instance
        if (typeof window !== 'undefined' && (window as unknown as { msalInstance?: PublicClientApplication }).msalInstance) {
          instance = (window as unknown as { msalInstance: PublicClientApplication }).msalInstance;
        } else {
          instance = new PublicClientApplication(msalConfig);
          await instance.initialize();
          // Store it globally to prevent multiple instances
          if (typeof window !== 'undefined') {
            (window as unknown as { msalInstance: PublicClientApplication }).msalInstance = instance;
          }
        }

        // Check URL parameters for error information first
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        if (error) {
          console.error('Authentication error from URL:', error);
          console.error('Error description:', errorDescription);
          
          // Clear any stored auth data on error
          localStorage.removeItem('auth_authenticated');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_method');
          
          // Check if user cancelled the login
          if (error === 'access_denied' || 
              errorDescription?.includes('User cancelled')) {
            console.log('User cancelled authentication');
            setStatus('error');
            setTimeout(() => {
              const savedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
              router.push(`/${savedLocale}`);
            }, 2000);
            return;
          }
          
          // Other authentication errors
          setStatus('error');
          setTimeout(() => {
            const savedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
            router.push(`/${savedLocale}`);
          }, 2000);
          return;
        }

        // Get stored auth method to determine which authority to use
        const storedAuthMethod = getStoredAuthMethod();
        console.log('Stored auth method:', storedAuthMethod);

        // Handle the redirect promise
        const redirectResponse = await instance.handleRedirectPromise();
        
        if (redirectResponse) {
          console.log('Redirect response received:', redirectResponse);
          
          // Check if we have a valid account
          if (!redirectResponse.account) {
            console.error('No account in redirect response');
            setStatus('error');
            setTimeout(() => {
              const savedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
              router.push(`/${savedLocale}`);
            }, 2000);
            return;
          }
          
          // Extract user profile and auth method
          const userProfile = extractUserProfile(redirectResponse.account);
          const detectedAuthMethod = determineAuthMethod(redirectResponse.account);
          
          console.log('User profile:', userProfile);
          console.log('Detected auth method:', detectedAuthMethod);
          
          // Store the auth method and user data
          if (detectedAuthMethod) {
            storeAuthMethod(detectedAuthMethod);
          }
          
          // Store user data in localStorage for the auth context to pick up
          localStorage.setItem('auth_user', JSON.stringify(userProfile));
          localStorage.setItem('auth_method', detectedAuthMethod || '');
          localStorage.setItem('auth_authenticated', 'true');
          
          setStatus('success');
          
          // Redirect to the appropriate localized page
          setTimeout(() => {
            const savedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
            router.push(`/${savedLocale}`);
          }, 2000);
        } else {
          // No redirect response, check if user is already authenticated
          const accounts = instance.getAllAccounts();
          if (accounts.length > 0) {
            const account = accounts[0];
            const userProfile = extractUserProfile(account);
            const detectedAuthMethod = determineAuthMethod(account);
            
            // Store the auth method and user data
            if (detectedAuthMethod) {
              storeAuthMethod(detectedAuthMethod);
            }
            
            localStorage.setItem('auth_user', JSON.stringify(userProfile));
            localStorage.setItem('auth_method', detectedAuthMethod || '');
            localStorage.setItem('auth_authenticated', 'true');
            
            setStatus('success');
            
            setTimeout(() => {
              const savedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
              router.push(`/${savedLocale}`);
            }, 2000);
          } else {
            setStatus('error');
            setTimeout(() => {
              const savedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
              router.push(`/${savedLocale}`);
            }, 3000);
          }
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
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Authentication Cancelled
          </h2>
          <p className="text-gray-600 mb-4">
            You cancelled the authentication process. You can try again anytime.
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting to home page in 2 seconds...
          </div>
        </div>
      </div>
    );
  }

  return null;
}