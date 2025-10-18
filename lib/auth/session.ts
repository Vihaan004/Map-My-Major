import { getServerSession } from 'next-auth';
import { authOptions } from './auth-options';
import type { Session } from 'next-auth';

/**
 * Get the current session on the server side
 * Use in Server Components, Server Actions, and API Routes
 */
export async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}

/**
 * Get the current user from the session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Require authentication - throws error if not authenticated
 * Use in API routes that require authentication
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized - Authentication required');
  }
  return user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}
