'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { account } from '@/lib/appwrite';
import { User } from '@/types';
import { isAdmin } from '@/utils';

// TODO: Replace with your own backend - Authentication Hook
// This hook manages user authentication state
// You'll need to:
// 1. Replace Appwrite auth calls with your authentication system
// 2. Update user data fetching to match your backend's user model
// 3. Handle authentication state persistence (localStorage, cookies, etc.)
// 4. Implement proper error handling for auth failures

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHost: boolean;
  isAdminUser: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await account.get();
      if (currentUser) {
        // TODO: Replace with your own backend - User Data Fetching
        // Replace this with your backend's user data fetching
        // Currently only gets basic auth data, you need to fetch full user profile
        // from your database including accountType, interests, etc.
        const userData: User = {
          userId: currentUser.$id,
          email: currentUser.email,
          displayName: currentUser.name || '',
          accountType: 'user', // TODO: Get from database
          isOnline: false,
          interests: [],
          createdAt: currentUser.$createdAt,
          updatedAt: currentUser.$updatedAt,
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isHost: user?.accountType === 'host',
    isAdminUser: user ? isAdmin(user.email) : false,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};