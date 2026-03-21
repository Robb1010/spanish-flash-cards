import { supabase } from './supabase';

let cachedUserId = null;

export async function ensureUser() {
  if (cachedUserId) return cachedUserId;

  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    cachedUserId = session.user.id;
    return cachedUserId;
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  cachedUserId = data.user.id;
  return cachedUserId;
}
