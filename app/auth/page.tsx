'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '@/lib/auth/msalConfig';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('processing');
        
        // Check URL parameters for error information first
        console.log('Current URL:', window.location.href);
        console.log('URL search params:', window.location.search);
        console.log('URL hash:', window.location.hash);
        
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        console.log('Error from URL params:', error);
        console.log('Error description:', errorDescription);
        
        if (error) {
          console.error('Authentication error from URL:', error);
          console.error('Error description:', errorDescription);
          
          // Clear any stored auth data on error
          localStorage.removeItem('auth_authenticated');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_method');
          localStorage.removeItem('access_token');
          localStorage.removeItem('id_token');
          
          setStatus('error');
          setTimeout(() => {
            const savedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
            router.push(`/${savedLocale}`);
          }, 2000);
          return;
        }

        // Initialize MSAL instance (reuse existing if available)
        let instance: PublicClientApplication;
        
        console.log('MSAL Config:', {
          clientId: msalConfig.auth.clientId,
          authority: msalConfig.auth.authority,
          redirectUri: msalConfig.auth.redirectUri,
          knownAuthorities: msalConfig.auth.knownAuthorities
        });
        
        // Check if there's already a global MSAL instance
        if (typeof window !== 'undefined' && (window as unknown as { msalInstance?: PublicClientApplication }).msalInstance) {
          console.log('Using existing global MSAL instance');
          instance = (window as unknown as { msalInstance: PublicClientApplication }).msalInstance;
        } else {
          console.log('Creating new MSAL instance');
          instance = new PublicClientApplication(msalConfig);
          await instance.initialize();
          console.log('MSAL instance initialized');
          // Store it globally to prevent multiple instances
          if (typeof window !== 'undefined') {
            (window as unknown as { msalInstance: PublicClientApplication }).msalInstance = instance;
          }
        }

        // Handle the redirect promise
        console.log('Handling redirect promise...');
        const redirectResponse = await instance.handleRedirectPromise();
        console.log('Redirect promise result:', redirectResponse);
        
        if (redirectResponse) {
          console.log('Redirect response received:', redirectResponse);
          console.log('Access token from redirect:', redirectResponse.accessToken ? 'Available' : 'Not available');
          console.log('Access token length:', redirectResponse.accessToken?.length || 0);
          console.log('Account info:', redirectResponse.account);
          
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
          const userProfile = {
            name: redirectResponse.account.name || redirectResponse.account.username,
            email: redirectResponse.account.username,
            id: redirectResponse.account.homeAccountId,
          };
          
          // Determine auth method based on authority
          const detectedAuthMethod = redirectResponse.account.environment?.includes('b2clogin.com') 
            ? (redirectResponse.account.username?.includes('@') ? 'otp' : 'vipps')
            : 'otp';
          
          console.log('User profile:', userProfile);
          console.log('Detected auth method:', detectedAuthMethod);
          
          // Store user data and tokens
          localStorage.setItem('auth_user', JSON.stringify(userProfile));
          localStorage.setItem('auth_method', detectedAuthMethod);
          localStorage.setItem('auth_authenticated', 'true');
          
          // Store access token if available
          if (redirectResponse.accessToken) {
            localStorage.setItem('access_token', redirectResponse.accessToken);
            console.log('Access token stored from redirect response');
          }
          
          // Store ID token if available
          if (redirectResponse.idToken) {
            localStorage.setItem('id_token', redirectResponse.idToken);
            console.log('ID token stored from redirect response');
          }
          
          setStatus('success');
          
          // Redirect to the appropriate localized page
          setTimeout(() => {
            const savedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
            router.push(`/${savedLocale}`);
          }, 2000);
        } else {
          // No redirect response, check if user is already authenticated
          console.log('No redirect response, checking existing accounts...');
          const accounts = instance.getAllAccounts();
          console.log('Existing accounts:', accounts.length);
          
          if (accounts.length > 0) {
            console.log('Found existing account, processing...');
            const account = accounts[0];
            console.log('Account details:', {
              username: account.username,
              homeAccountId: account.homeAccountId,
              environment: account.environment
            });
            
            const userProfile = {
              name: account.name || account.username,
              email: account.username,
              id: account.homeAccountId,
            };
            
            const detectedAuthMethod = account.environment?.includes('b2clogin.com') 
              ? (account.username?.includes('@') ? 'otp' : 'vipps')
              : 'otp';
            
            localStorage.setItem('auth_user', JSON.stringify(userProfile));
            localStorage.setItem('auth_method', detectedAuthMethod);
            localStorage.setItem('auth_authenticated', 'true');
            
            // Try to get tokens for existing account
            try {
              const tokenRequest = {
                scopes: ['openid', 'profile', 'email'],
                account: account,
              };
              
              console.log('Attempting to get tokens for existing account...');
              const tokenResponse = await instance.acquireTokenSilent(tokenRequest);
              console.log('Token response:', tokenResponse);
              
              if (tokenResponse.accessToken) {
                localStorage.setItem('access_token', tokenResponse.accessToken);
                console.log('Access token stored from existing account');
              }
              
              if (tokenResponse.idToken) {
                localStorage.setItem('id_token', tokenResponse.idToken);
                console.log('ID token stored from existing account');
              }
            } catch (tokenError) {
              console.error('Error getting tokens for existing account:', tokenError);
            }
            
            setStatus('success');
            
            setTimeout(() => {
              const savedLocale = localStorage.getItem('NEXT_LOCALE') || 'en';
              router.push(`/${savedLocale}`);
            }, 2000);
          } else {
            console.log('No existing accounts found');
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