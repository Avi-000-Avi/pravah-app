/**
 * Edge function: delete-account
 *
 * DPDP-compliant hard delete. Deno runtime.
 *
 * Flow:
 *   1. Verify the caller's JWT (Supabase auto-validates Authorization header
 *      when called via the gateway; we re-fetch the user to be safe).
 *   2. Use the service-role admin client to delete the auth.users row.
 *   3. The ON DELETE CASCADE on public.users -> public.meal_preferences
 *      removes all profile data atomically.
 *
 * Deploy:
 *   supabase functions deploy delete-account --no-verify-jwt
 *   (We verify manually so we can return JSON errors instead of 401 HTML.)
 *
 * Required env on the function:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY     (kept server-only — NEVER ship to client)
 *
 * Call from the app:
 *   await supabase.functions.invoke('delete-account', { method: 'DELETE' });
 */

// @ts-expect-error — Deno-only import URL; this file runs in Supabase Edge runtime, not Node.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-expect-error — Deno global is provided by the runtime.
const env = (k: string): string => Deno.env.get(k) ?? '';

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// @ts-expect-error — Deno.serve is the standard entry point for Supabase functions.
Deno.serve(async (req: Request) => {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'missing_token' }, 401);
  }

  const SUPABASE_URL = env('SUPABASE_URL');
  const SERVICE_ROLE = env('SUPABASE_SERVICE_ROLE_KEY');

  // Client tied to the caller's JWT — used only to identify them.
  const userClient = createClient(SUPABASE_URL, env('SUPABASE_ANON_KEY'), {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData.user) {
    return json({ error: 'invalid_token' }, 401);
  }

  // Admin client — bypasses RLS to delete the auth row, which cascades.
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: delErr } = await admin.auth.admin.deleteUser(userData.user.id);
  if (delErr) {
    return json({ error: 'delete_failed', detail: delErr.message }, 500);
  }

  return json({ success: true });
});
