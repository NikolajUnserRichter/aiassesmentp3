import { PublicClientApplication, EventType, AuthenticationResult, AccountInfo } from '@azure/msal-browser';
import { msalConfig } from './msal-config';

// Initialize MSAL instance
let msalInstance: PublicClientApplication | null = null;

export function getMsalInstance(): PublicClientApplication {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);

    // Set up event callbacks
    msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        const result = event.payload as AuthenticationResult;
        if (result?.account) {
          msalInstance!.setActiveAccount(result.account);
        }
      }

      if (event.eventType === EventType.LOGOUT_SUCCESS) {
        msalInstance!.setActiveAccount(null);
      }

      if (event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
        // Token acquired successfully
      }

      if (event.eventType === EventType.LOGIN_FAILURE || event.eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
        console.error('MSAL Error:', event.error);
      }
    });
  }

  return msalInstance;
}

// Initialize and handle redirect
export async function initializeMsal(): Promise<PublicClientApplication> {
  const instance = getMsalInstance();

  try {
    // Handle redirect response
    const response = await instance.handleRedirectPromise();

    if (response) {
      instance.setActiveAccount(response.account);
    } else {
      // Check if there are accounts in cache
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        instance.setActiveAccount(accounts[0]);
      }
    }
  } catch (error) {
    console.error('Error initializing MSAL:', error);
  }

  return instance;
}

// Get the active account
export function getActiveAccount(): AccountInfo | null {
  const instance = getMsalInstance();
  return instance.getActiveAccount();
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const account = getActiveAccount();
  return account !== null;
}
