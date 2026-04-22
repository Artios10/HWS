'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { account } from '@/lib/appwrite';
import { User } from '@/types';
import { isAdmin } from '@/utils';

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
        // TODO: Fetch additional user data from database
        // For now, create a basic user object
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