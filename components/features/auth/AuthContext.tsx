'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
// AuthenticationResult is no longer needed since we use redirect instead of popup
import { useMsal } from './hooks/useMsal';
import { useAuthTokens } from './hooks/useAuthTokens';
import { getLoginRequest, logoutRequest } from '@/lib/auth/msalConfig';
import { 
  determineAuthMethod, 
  storeAuthMethod, 
  getStoredAuthMethod, 
  clearStoredAuthMethod,
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
  const { account } = useAuthTokens();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize authentication on mount
  useEffect(() => {
    if (!isClient || !msalInstance || !isMsalInitialized) return;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if user is already logged in
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
      console.log('Vipps login request:', loginRequest);
      await msalInstance.loginRedirect(loginRequest);
      // Note: The response will be handled by the handleRedirectPromise in the MSAL instance
    } catch (error: unknown) {
      console.error('Vipps login error:', error);
      setError(handleAuthError(error));
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
      console.log('OTP login request:', loginRequest);
      await msalInstance.loginRedirect(loginRequest);
      // Note: The response will be handled by the handleRedirectPromise in the MSAL instance
    } catch (error: unknown) {
      console.error('OTP login error:', error);
      setError(handleAuthError(error));
      setIsLoading(false);
    }
  }, [msalInstance, isMsalInitialized]);

  const logout = useCallback(async () => {
    if (!msalInstance || !isMsalInitialized) {
      // Clear local state even if MSAL is not ready
      setIsAuthenticated(false);
      setUser(null);
      setAuthMethod(null);
      clearStoredAuthMethod();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Clear local state first
      setIsAuthenticated(false);
      setUser(null);
      setAuthMethod(null);
      clearStoredAuthMethod();

      // Then redirect to logout
      await msalInstance.logoutRedirect(logoutRequest);
    } catch (error: unknown) {
      console.error('Logout error:', error);
      setError(handleAuthError(error));
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
