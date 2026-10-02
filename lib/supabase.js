import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Support both old (ANON_KEY) and new (PUBLISHABLE_KEY) Supabase naming
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL dan Key belum diset! Cek file .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
