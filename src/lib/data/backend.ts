/**
 * Backend mode — whether data repos talk to Supabase or local storage.
 *
 * The app currently runs without an auth session (the route guard
 * bypasses auth), so repos persist locally. The moment a session
 * exists, the same repo calls go to Supabase with RLS enforcing
 * ownership. This is the entire seam: no screen or hook changes.
 */
import { supabase } from '@/lib/supabase';
import { captureError } from '@/lib/monitoring';
import { LOCAL_USER_ID } from './localStore';

export interface BackendSession {
  mode: 'remote' | 'local';
  userId: string;
}

export async function getBackendSession(): Promise<BackendSession> {
  try {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (userId) return { mode: 'remote', userId };
  } catch (error) {
    // Unreachable backend is a normal prototype condition — stay local.
    captureError(error);
  }
  return { mode: 'local', userId: LOCAL_USER_ID };
}
