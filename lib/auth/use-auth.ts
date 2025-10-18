'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

  const login = async (callbackUrl = '/dashboard') => {
    await signIn('google', { callbackUrl });
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const requireAuth = () => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  };

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    login,
    logout,
    requireAuth,
  };
}
