'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
// AuthenticationResult is no longer needed since we use redirect instead of popup
import { PublicClientApplication } from '@azure/msal-browser';
import { useMsal } from './hooks/useMsal';
import { useAuthTokens } from './hooks/useAuthTokens';
import { getLoginRequest, logoutRequest } from '@/lib/auth/msalConfig';
import { 
  determineAuthMethod, 
  storeAuthMethod, 
  getStoredAuthMethod, 
  clearStoredAuthData,
  handleAuthError,
  extractUserProfile 
} from '@/lib/auth/authUtils';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  tenantId: string;
  homeAccountId: string;
  environment: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  isLoading: boolean;
  user: User | null;
  authMethod: 'vipps' | 'otp' | null;
  error: string | null;
  msalInstance: PublicClientApplication | null;
  accessToken: string | null;
  refreshToken: () => Promise<string | null>;
  syncTokensFromStorage: () => void;
  loginWithVipps: () => Promise<void>;
  loginWithOTP: () => Promise<void>;
  logout: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authMethod, setAuthMethod] = useState<'vipps' | 'otp' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { instance: msalInstance, isInitialized: isMsalInitialized } = useMsal();
  const { account, accessToken, refreshToken: refreshAuthToken, syncTokensFromStorage } = useAuthTokens();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Listen for storage changes to handle auth state updates
  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = (e: StorageEvent) => {
      // Skip if we're on the auth page (to prevent errors during auth flow)
      if (window.location.pathname === '/auth') {
        return;
      }

      if (e.key === 'auth_authenticated' && e.newValue === 'true') {
        // Auth data was stored, refresh the auth state
        const storedUserData = localStorage.getItem('auth_user');
        const storedAuthMethod = localStorage.getItem('auth_method');
        
        if (storedUserData && storedAuthMethod) {
          console.log('Storage change detected, updating auth state');
          try {
            const userProfile = JSON.parse(storedUserData);
            setUser(userProfile);
            setIsAuthenticated(true);
            setAuthMethod(storedAuthMethod as 'vipps' | 'otp');
          } catch (error) {
            console.error('Error parsing stored user data in storage change:', error);
          }
        }
      } else if (e.key === 'auth_authenticated' && e.newValue === null) {
        // Auth data was cleared, clear the auth state
        console.log('Auth data cleared, updating auth state');
        setIsAuthenticated(false);
        setUser(null);
        setAuthMethod(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isClient]);

  // Initialize authentication on mount
  useEffect(() => {
    if (!isClient) return;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First check if we have stored auth data from the /auth callback
        const storedAuthData = localStorage.getItem('auth_authenticated');
        const storedUserData = localStorage.getItem('auth_user');
        const storedAuthMethod = localStorage.getItem('auth_method');

        if (storedAuthData === 'true' && storedUserData && storedAuthMethod) {
          console.log('Found stored auth data, setting user state');
          try {
            const userProfile = JSON.parse(storedUserData);
            setUser(userProfile);
            setIsAuthenticated(true);
            setAuthMethod(storedAuthMethod as 'vipps' | 'otp');
            setIsLoading(false);
            
            // Clear the stored auth data flag after a delay to allow future token refreshes
            // This prevents the endpoints_resolution_error on page reload
            setTimeout(() => {
              localStorage.removeItem('auth_authenticated');
              console.log('Cleared stored auth data flag to allow future token refreshes');
            }, 5000); // 5 second delay
            
            // Don't return here - let the MSAL instance initialize for future token refreshes
            // but don't immediately try to refresh tokens
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            // Clear corrupted data
            localStorage.removeItem('auth_authenticated');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_method');
          }
        }

        // If no stored data, check MSAL instance
        if (!msalInstance || !isMsalInitialized) {
          // Check for stored auth method preference
          const storedMethod = getStoredAuthMethod();
          setAuthMethod(storedMethod);
          setIsLoading(false);
          return;
        }

        // Check if user is already logged in via MSAL
        const accounts = msalInstance.getAllAccounts();
        
        if (accounts.length > 0) {
          const account = accounts[0];
          const userProfile = extractUserProfile(account);
          const detectedAuthMethod = determineAuthMethod(account);
          
          setUser(userProfile);
          setIsAuthenticated(true);
          setAuthMethod(detectedAuthMethod);
          
          // Store the detected auth method
          if (detectedAuthMethod) {
            storeAuthMethod(detectedAuthMethod);
          }
        } else {
          // Check for stored auth method preference
          const storedMethod = getStoredAuthMethod();
          setAuthMethod(storedMethod);
        }
      } catch (error: unknown) {
        console.error('Auth initialization error:', error);
        setError(handleAuthError(error));
        // Clear potentially corrupted session
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, msalInstance, isMsalInitialized]);

  // Update user state when account changes
  useEffect(() => {
    if (account) {
      const userProfile = extractUserProfile(account);
      const detectedAuthMethod = determineAuthMethod(account);
      
      setUser(userProfile);
      setIsAuthenticated(true);
      setAuthMethod(detectedAuthMethod);
      
      // Store the detected auth method
      if (detectedAuthMethod) {
        storeAuthMethod(detectedAuthMethod);
      }
      
      // Close auth modal if open
      closeAuthModal();
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [account]);

  const loginWithVipps = useCallback(async () => {
    if (!msalInstance || !isMsalInitialized) {
      setError('Authentication system is not ready. Please try again.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const loginRequest = getLoginRequest('vipps');
      
      // Store the auth method before redirecting
      storeAuthMethod('vipps');
      
      await msalInstance.loginRedirect(loginRequest);
      // Note: The response will be handled by the handleRedirectPromise in the MSAL instance
    } catch (error: unknown) {
      console.error('Vipps login error:', error);
      
      // Handle specific MSAL errors
      if (error && typeof error === 'object' && 'errorCode' in error) {
        const errorCode = error.errorCode as string;
        
        if (errorCode === 'endpoints_resolution_error') {
          setError('Authentication system is initializing. Please wait a moment and try again.');
        } else if (errorCode === 'user_cancelled') {
          setError('Login was cancelled. Please try again if you want to sign in.');
        } else if (errorCode === 'popup_window_error') {
          setError('Popup was blocked. Please allow popups for this site and try again.');
        } else {
          setError(handleAuthError(error));
        }
      } else {
        setError(handleAuthError(error));
      }
      
      setIsLoading(false);
    }
  }, [msalInstance, isMsalInitialized]);

  const loginWithOTP = useCallback(async () => {
    if (!msalInstance || !isMsalInitialized) {
      setError('Authentication system is not ready. Please try again.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const loginRequest = getLoginRequest('otp');
      
      // Validate OTP authority URL before attempting login
      const otpAuthority = process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE;
      if (!otpAuthority) {
        setError('OTP authentication is not configured. Please check your environment variables.');
        setIsLoading(false);
        return;
      }
      
      // Store the auth method before redirecting
      storeAuthMethod('otp');
      
      await msalInstance.loginRedirect(loginRequest);
      // Note: The response will be handled by the handleRedirectPromise in the MSAL instance
    } catch (error: unknown) {
      console.error('OTP login error:', error);
      
      // Handle specific MSAL errors
      if (error && typeof error === 'object' && 'errorCode' in error) {
        const errorCode = error.errorCode as string;
        
        if (errorCode === 'endpoints_resolution_error') {
          setError('Authentication system is initializing. Please wait a moment and try again.');
        } else if (errorCode === 'user_cancelled') {
          setError('Login was cancelled. Please try again if you want to sign in.');
        } else if (errorCode === 'popup_window_error') {
          setError('Popup was blocked. Please allow popups for this site and try again.');
        } else if (errorCode === 'invalid_authority') {
          setError('Invalid OTP authority URL. Please check your Azure B2C configuration.');
        } else {
          setError(handleAuthError(error));
        }
      } else {
        setError(handleAuthError(error));
      }
      
      setIsLoading(false);
    }
  }, [msalInstance, isMsalInitialized]);

  const logout = useCallback(async () => {
    if (!msalInstance || !isMsalInitialized) {
      // Clear local state even if MSAL is not ready
      setIsAuthenticated(false);
      setUser(null);
      setAuthMethod(null);
      clearStoredAuthData();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Clear local state first
      setIsAuthenticated(false);
      setUser(null);
      setAuthMethod(null);
      clearStoredAuthData();

      // Clear stored tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('auth_authenticated');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_method');

      // Then redirect to logout
      await msalInstance.logoutRedirect(logoutRequest);
    } catch (error: unknown) {
      console.error('Logout error:', error);
      
      // Handle specific MSAL errors
      if (error && typeof error === 'object' && 'errorCode' in error) {
        const errorCode = error.errorCode as string;
        
        if (errorCode === 'endpoints_resolution_error') {
          setError('Authentication system is initializing. Please wait a moment and try again.');
        } else {
          setError(handleAuthError(error));
        }
      } else {
        setError(handleAuthError(error));
      }
      
      setIsLoading(false);
    }
  }, [msalInstance, isMsalInitialized]);

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const clearError = () => {
    setError(null);
  };

  // Refresh token function that returns the new access token
  const refreshToken = useCallback(async (): Promise<string | null> => {
    if (!msalInstance || !isMsalInitialized) {
      console.warn('MSAL instance not available for token refresh');
      return null;
    }

    try {
      console.log('Refreshing token via auth context...');
      await refreshAuthToken();
      console.log('Token refresh completed, current access token:', accessToken ? 'Available' : 'Not available');
      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }, [msalInstance, isMsalInitialized, refreshAuthToken, accessToken]);

  // Prevent hydration mismatch by not rendering auth-dependent content on server
  if (!isClient) {
    return (
      <AuthContext.Provider value={{ 
        isAuthenticated: false, 
        isAuthModalOpen: false,
        isLoading: true,
        user: null,
        authMethod: null,
        error: null,
        msalInstance: null,
        accessToken: null,
        refreshToken: async () => null,
        syncTokensFromStorage: () => {},
        loginWithVipps: async () => {},
        loginWithOTP: async () => {},
        logout: async () => {},
        openAuthModal,
        closeAuthModal,
        clearError
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAuthModalOpen,
      isLoading,
      user,
      authMethod,
      error,
      msalInstance,
      accessToken,
      refreshToken,
      syncTokensFromStorage,
      loginWithVipps,
      loginWithOTP,
      logout,
      openAuthModal,
      closeAuthModal,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
