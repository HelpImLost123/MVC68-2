import { cookies } from 'next/headers';
import { UserData } from '@/models';

const SESSION_COOKIE_NAME = 'auth_session';

export interface SessionData {
  user: Omit<UserData, 'password'>;
  expiresAt: number;
}

/**
 * Create a session for authenticated user
 */
export async function createSession(user: Omit<UserData, 'password'>): Promise<void> {
  const sessionData: SessionData = {
    user,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });
}

/**
 * Get current session
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      return null;
    }

    const sessionData: SessionData = JSON.parse(sessionCookie.value);

    // Check if session is expired
    if (sessionData.expiresAt < Date.now()) {
      await destroySession();
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Destroy current session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.user.role === 'admin';
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<Omit<UserData, 'password'> | null> {
  const session = await getSession();
  return session?.user || null;
}
