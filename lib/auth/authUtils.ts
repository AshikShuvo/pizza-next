import { AccountInfo } from '@azure/msal-browser';

// Auth method detection from account
export const determineAuthMethod = (account: AccountInfo | null): 'vipps' | 'otp' | null => {
  if (!account) return null;

  // Check issuer for Vipps
  if (account.idTokenClaims?.iss?.includes('vipps')) {
    return 'vipps';
  }

  // Check authentication method reference for OTP
  if (account.idTokenClaims?.amr?.includes('otp') || 
      account.idTokenClaims?.amr?.includes('phone')) {
    return 'otp';
  }

  // Check user flow name in token claims
  if (account.idTokenClaims?.tfp?.includes('vipps')) {
    return 'vipps';
  }
  
  if (account.idTokenClaims?.tfp?.includes('otp')) {
    return 'otp';
  }

  return null;
};

// Store auth method preference
export const storeAuthMethod = (method: 'vipps' | 'otp'): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_method', method);
  }
};

// Get stored auth method
export const getStoredAuthMethod = (): 'vipps' | 'otp' | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_method') as 'vipps' | 'otp' | null;
  }
  return null;
};

// Clear stored auth method
export const clearStoredAuthMethod = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_method');
  }
};

// Check if token is expired
export const isTokenExpired = (expiresOn: string | number): boolean => {
  const expiryTime = typeof expiresOn === 'string' ? parseInt(expiresOn) : expiresOn;
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= expiryTime;
};

// Extract user profile from account
export const extractUserProfile = (account: AccountInfo) => {
  return {
    id: account.localAccountId,
    username: account.username,
    name: account.name || account.idTokenClaims?.name || '',
    email: account.username,
    tenantId: account.tenantId,
    homeAccountId: account.homeAccountId,
    environment: account.environment,
  };
};

// Handle authentication errors
export const handleAuthError = (error: unknown): string => {
  console.error('Auth error:', error);
  
  if (error && typeof error === 'object' && 'errorCode' in error) {
    switch (error.errorCode) {
    case 'interaction_required':
      return 'Please sign in to continue';
    case 'consent_required':
      return 'Please provide consent to continue';
    case 'login_required':
      return 'Please sign in to continue';
    case 'popup_window_error':
      return 'Authentication popup was blocked. Please allow popups and try again.';
    case 'user_cancelled':
      return 'Authentication was cancelled';
    case 'network_error':
      return 'Network error. Please check your connection and try again.';
    default:
      return 'Authentication failed. Please try again.';
    }
  }
  
  return 'Authentication failed. Please try again.';
};

// Validate environment variables
export const validateMsalConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!process.env.NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID) {
    errors.push('NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID is required');
  }
  
  if (!process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY) {
    errors.push('NEXT_PUBLIC_AD_PUBLIC_AUTHORITY is required');
  }
  
  if (!process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE) {
    errors.push('NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE is required');
  }
  
  if (!process.env.NEXT_PUBLIC_AD_PUBLIC_REDIRECT_URL) {
    errors.push('NEXT_PUBLIC_AD_PUBLIC_REDIRECT_URL is required');
  }
  
  if (!process.env.NEXT_PUBLIC_AD_PUBLIC_POST_LOGOUT_REDIRECT_URL) {
    errors.push('NEXT_PUBLIC_AD_PUBLIC_POST_LOGOUT_REDIRECT_URL is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
