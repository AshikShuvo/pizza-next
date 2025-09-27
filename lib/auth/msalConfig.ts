import { Configuration, RedirectRequest } from '@azure/msal-browser';

// Helper function to get the correct redirect URI
const getRedirectUri = (): string => {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000/auth';
  }
  
  return `${window.location.origin}/auth`;
};

// Base MSAL Configuration (without specific authority)
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID || '',
    authority: process.env.NEXT_PUBLIC_AD_PUBLIC_KNOWN_AUTHORITY || '', // Use known authority as base
    knownAuthorities: [process.env.NEXT_PUBLIC_AD_PUBLIC_KNOWN_AUTHORITY || ''],
    redirectUri: process.env.NEXT_PUBLIC_AD_PUBLIC_REDIRECT_URL || getRedirectUri(),
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_AD_PUBLIC_POST_LOGOUT_REDIRECT_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
  },
  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
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
  scopes: [ process.env.NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID || '', 'openid', 'profile', 'email'],
};

export const loginRequestOTP: RedirectRequest = {
  scopes: [ process.env.NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID || '', 'openid', 'profile', 'email'],
  authority: process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE || '',
};

export const loginRequestVipps: RedirectRequest = {
  scopes: [ process.env.NEXT_PUBLIC_AD_PUBLIC_CLIENT_ID || '', 'openid', 'profile', 'email'],
  authority: process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY || '',
};

// Token request for silent authentication
export const tokenRequest = {
  scopes: ['openid', 'profile', 'email'],
  forceRefresh: false,
};

// Logout request
export const logoutRequest = {
  postLogoutRedirectUri: process.env.NEXT_PUBLIC_AD_PUBLIC_POST_LOGOUT_REDIRECT_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'),
};

// Helper function to get authority based on auth method
export const getAuthority = (authMethod: 'vipps' | 'otp'): string => {
  return authorities[authMethod] || authorities.vipps;
};

// Helper function to get login request based on auth method
export const getLoginRequest = (authMethod: 'vipps' | 'otp'): RedirectRequest => {
  const baseRequest = {
    scopes: ['openid', 'profile', 'email'],
    prompt: 'select_account' as const,
  };

  if (authMethod === 'otp') {
    return {
      ...baseRequest,
      authority: process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY_PHONE || '',
    };
  } else {
    return {
      ...baseRequest,
      authority: process.env.NEXT_PUBLIC_AD_PUBLIC_AUTHORITY || '',
    };
  }
};
