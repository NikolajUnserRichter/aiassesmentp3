import { Configuration, LogLevel } from '@azure/msal-browser';

// MSAL configuration for Azure AD authentication
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID || 'common'}`,
    redirectUri: process.env.NEXT_PUBLIC_AZURE_AD_REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : ''),
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_AZURE_AD_POST_LOGOUT_URI || (typeof window !== 'undefined' ? window.location.origin : ''),
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            // console.info(message);
            break;
          case LogLevel.Verbose:
            // console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
      logLevel: LogLevel.Warning,
    },
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
  },
};

// Login request scopes
export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};

// Token request for Graph API
export const graphRequest = {
  scopes: ['User.Read'],
};

// Validate configuration
export function validateMsalConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID) {
    errors.push('NEXT_PUBLIC_AZURE_AD_CLIENT_ID is required');
  }

  if (!process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID) {
    errors.push('NEXT_PUBLIC_AZURE_AD_TENANT_ID is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
