'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireHost?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireHost = false,
  requireAdmin = false,
  redirectTo = '/sign-in',
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, isHost, isAdminUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (requireHost && !isHost) {
      router.push('/dashboard');
      return;
    }

    if (requireAdmin && !isAdminUser) {
      router.push('/dashboard');
      return;
    }
  }, [isLoading, isAuthenticated, isHost, isAdminUser, requireAuth, requireHost, requireAdmin, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireHost && !isHost) {
    return null;
  }

  if (requireAdmin && !isAdminUser) {
    return null;
  }

  return <>{children}</>;
}