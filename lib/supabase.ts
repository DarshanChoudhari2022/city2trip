import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/platform-env";

export function hasSupabaseConfig() {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export function supabase() {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase is not configured.");
  }

  return createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function storageBucket() {
  return env.SUPABASE_STORAGE_BUCKET || "city2trip-media";
}