'use client';

import * as React from 'react';
import { useMsal, useIsAuthenticated, useAccount } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from './msal-config';
import { getUserByAzureId, createUser } from '@/lib/supabase/queries';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticatedMsal = useIsAuthenticated();
  const account = useAccount(accounts[0] || {});

  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Sync user with Supabase when authenticated
  const syncUserWithSupabase = React.useCallback(async () => {
    if (!account) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Try to get existing user
      let dbUser = await getUserByAzureId(account.localAccountId);

      // Create user if doesn't exist
      if (!dbUser) {
        dbUser = await createUser({
          azure_id: account.localAccountId,
          email: account.username || '',
          name: account.name || account.username || 'Unknown User',
        });
      }

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
        syncUserWithSupabase();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }
  }, [isAuthenticatedMsal, account, inProgress, syncUserWithSupabase]);

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
    await syncUserWithSupabase();
  };

  const value = {
    user,
    isAuthenticated: isAuthenticatedMsal && !!user,
    isLoading: isLoading || inProgress !== InteractionStatus.None,
    error,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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
