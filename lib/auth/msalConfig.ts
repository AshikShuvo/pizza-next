import { Configuration, RedirectRequest } from '@azure/msal-browser';

// Helper function to get the correct redirect URI based on current locale
const getRedirectUri = (): string => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_AD_PUBLIC_REDIRECT_URL || 'http://localhost:3000/auth';
  }
  
  // Check if we're in a locale-based route
  const pathname = window.location.pathname;
  const localeMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  
  if (localeMatch) {
    const locale = localeMatch[1];
    const baseUrl = window.location.origin;
    return `${baseUrl}/${locale}/auth`;
  }
  
  // Fallback to non-locale route
  return process.env.NEXT_PUBLIC_AD_PUBLIC_REDIRECT_URL || 'http://localhost:3000/auth';
};

// Export for potential future use
export { getRedirectUri };

// Base MSAL Configuration (without specific authority)
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID || '',
    authority: process.env.NEXT_PUBLIC_AD_PUBLIC_KNOWN_AUTHORITY || '', // Use known authority as base
    knownAuthorities: [process.env.NEXT_PUBLIC_AD_PUBLIC_KNOWN_AUTHORITY || ''],
    redirectUri: process.env.NEXT_PUBLIC_AD_PUBLIC_REDIRECT_URL,
    navigateToLoginRequestUrl: true,
    // Enable PKCE for better security and to prevent "code challenge must be present" errors
    clientCapabilities: ['CP1'], // Enable PKCE
  },
  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: true, // Set this to "true" for better reliability
    secureCookies: true,
  },
  system: {
    tokenRenewalOffsetSeconds: 300,
    allowRedirectInIframe: true,
    iframeHashTimeout: 15000,
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0: // LogLevel.Error
            console.error(message);
            break;
          case 1: // LogLevel.Warning
            console.warn(message);
            break;
          case 2: // LogLevel.Info
            console.info(message);
            break;
          case 3: // LogLevel.Verbose
            console.debug(message);
            break;
        }
      },
      piiLoggingEnabled: false,
    },
  },
};

// Authority configurations for different authentication methods
export const authorities = {
  vipps: process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY || '',
  otp: process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE || '',
};

// Login request configurations
export const loginRequest: RedirectRequest = {
  scopes: [process.env.NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID||'','openid', 'profile', 'email'],
  // Enable PKCE for all login requests
  extraQueryParameters: {
    prompt: 'select_account'
  },
};

export const loginRequestOTP: RedirectRequest = {
  scopes: [process.env.NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID||'','openid', 'profile', 'email'],
  authority: process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE || '',
};

export const loginRequestVipps: RedirectRequest = {
  scopes: [process.env.NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID||'','openid', 'profile', 'email'],
  authority: process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY || '',
};

// Token request for silent authentication
export const tokenRequest = {
  scopes: [process.env.NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID,'openid', 'profile', 'email'],
  forceRefresh: false,
};

// Helper function to get the correct post-logout redirect URI based on current locale
const getPostLogoutRedirectUri = (): string => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_AD_PUBLIC_POST_LOGOUT_REDIRECT_URL || 'http://localhost:3000';
  }
  
  // Check if we're in a locale-based route
  const pathname = window.location.pathname;
  const localeMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  
  if (localeMatch) {
    const locale = localeMatch[1];
    const baseUrl = window.location.origin;
    return `${baseUrl}/${locale}`;
  }
  
  // Fallback to non-locale route
  return process.env.NEXT_PUBLIC_AD_PUBLIC_POST_LOGOUT_REDIRECT_URL || window.location.origin;
};

// Logout request
export const logoutRequest = {
  postLogoutRedirectUri: getPostLogoutRedirectUri(),
};

// Helper function to get authority based on auth method
export const getAuthority = (authMethod: 'vipps' | 'otp'): string => {
  return authorities[authMethod] || authorities.vipps;
};

// Helper function to get login request based on auth method
export const getLoginRequest = (authMethod: 'vipps' | 'otp'): RedirectRequest => {
  const baseRequest = {
    scopes: [process.env.NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID || '', 'openid', 'profile', 'email'],
  };

  if (authMethod === 'otp') {
    const otpAuthority = process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE || '';
    
    if (!otpAuthority) {
      console.error('OTP Authority URL is not configured! Check NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE environment variable.');
    }
    
    return {
      ...baseRequest,
      authority: otpAuthority,
    };
  } else {
    const vippsAuthority = process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY || '';
    
    return {
      ...baseRequest,
      authority: vippsAuthority,
    };
  }
};
