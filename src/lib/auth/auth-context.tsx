'use client';

import * as React from 'react';
import { useMsal, useIsAuthenticated, useAccount } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from './msal-config';
import type { User } from '@/types';

// Dev bypass check
const DEV_AUTH_BYPASS = process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === 'true';

// Mock user for dev bypass
const MOCK_DEV_USER: User = {
  id: '00000000-0000-0000-0000-000000000001',
  azure_id: 'dev-azure-id-001',
  email: 'dev@p3-group.com',
  name: 'Dev User',
  role: 'admin',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isDevBypass: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Separate provider for dev bypass mode
function DevBypassAuthProvider({ children }: AuthProviderProps) {
  const [user] = React.useState<User>(MOCK_DEV_USER);

  const value: AuthContextType = {
    user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: async () => {
      console.log('[Dev Bypass] Login called - already authenticated');
    },
    logout: () => {
      console.log('[Dev Bypass] Logout called - reloading page');
      window.location.href = '/';
    },
    refreshUser: async () => {
      console.log('[Dev Bypass] Refresh user called');
    },
    isDevBypass: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Production provider with Azure AD
function AzureAuthProvider({ children }: AuthProviderProps) {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticatedMsal = useIsAuthenticated();
  const account = useAccount(accounts[0] || {});

  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Sync user with database when authenticated
  const syncUserWithDatabase = React.useCallback(async () => {
    if (!account) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call API route to sync user
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          azure_id: account.localAccountId,
          email: account.username || '',
          name: account.name || account.username || 'Unknown User',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync user');
      }

      const dbUser = await response.json();

      setUser({
        id: dbUser.id,
        azure_id: dbUser.azure_id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role as 'user' | 'admin',
        created_at: dbUser.created_at,
        updated_at: dbUser.updated_at,
      });
    } catch (err) {
      console.error('Error syncing user:', err);
      setError('Failed to sync user data');
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  // Sync user when account changes
  React.useEffect(() => {
    if (inProgress === InteractionStatus.None) {
      if (isAuthenticatedMsal && account) {
        syncUserWithDatabase();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }
  }, [isAuthenticatedMsal, account, inProgress, syncUserWithDatabase]);

  const login = async () => {
    try {
      setError(null);
      await instance.loginRedirect(loginRequest);
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to login');
      throw err;
    }
  };

  const logout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: '/',
    });
  };

  const refreshUser = async () => {
    await syncUserWithDatabase();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: isAuthenticatedMsal && !!user,
    isLoading: isLoading || inProgress !== InteractionStatus.None,
    error,
    login,
    logout,
    refreshUser,
    isDevBypass: false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Main provider that selects between dev bypass and Azure AD
export function AuthProvider({ children }: AuthProviderProps) {
  if (DEV_AUTH_BYPASS) {
    return <DevBypassAuthProvider>{children}</DevBypassAuthProvider>;
  }
  return <AzureAuthProvider>{children}</AzureAuthProvider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to require authentication
export function useRequireAuth(redirectTo: string = '/') {
  const { isAuthenticated, isLoading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShouldRedirect(true);
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading, shouldRedirect };
}

// Hook to require admin role
export function useRequireAdmin(redirectTo: string = '/dashboard') {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        setShouldRedirect(true);
      }
    }
  }, [isAuthenticated, isLoading, user]);

  return { isAdmin: user?.role === 'admin', isLoading, shouldRedirect };
}
