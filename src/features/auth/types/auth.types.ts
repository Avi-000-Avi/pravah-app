import type { Session, User } from '@supabase/supabase-js';

export type { Session, User };

export interface AuthError {
  message: string;
  code?: string;
}
