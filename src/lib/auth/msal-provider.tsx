'use client';

import * as React from 'react';
import { MsalProvider as MsalReactProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './msal-config';
import { AuthProvider } from './auth-context';

// Dev bypass check
const DEV_AUTH_BYPASS = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';

interface MsalProviderProps {
  children: React.ReactNode;
}

export function MsalProvider({ children }: MsalProviderProps) {
  const [msalInstance, setMsalInstance] = React.useState<PublicClientApplication | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(DEV_AUTH_BYPASS);

  React.useEffect(() => {
    // Skip MSAL initialization in dev bypass mode
    if (DEV_AUTH_BYPASS) {
      console.log('[Dev Bypass] Skipping MSAL initialization');
      return;
    }

    const initMsal = async () => {
      try {
        const instance = new PublicClientApplication(msalConfig);
        await instance.initialize();

        // Handle redirect response
        const response = await instance.handleRedirectPromise();
        if (response) {
          instance.setActiveAccount(response.account);
        } else {
          const accounts = instance.getAllAccounts();
          if (accounts.length > 0) {
            instance.setActiveAccount(accounts[0]);
          }
        }

        setMsalInstance(instance);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize MSAL:', error);
        setIsInitialized(true); // Allow app to render even if MSAL fails
      }
    };

    initMsal();
  }, []);

  // Show nothing while initializing
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-muted border-t-p3-purple-rain animate-spin" />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // Dev bypass mode - skip MSAL provider entirely
  if (DEV_AUTH_BYPASS) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  // If MSAL failed to initialize, render children without auth
  if (!msalInstance) {
    return <>{children}</>;
  }

  return (
    <MsalReactProvider instance={msalInstance}>
      <AuthProvider>{children}</AuthProvider>
    </MsalReactProvider>
  );
}
