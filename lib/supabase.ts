import { createClient } from "@supabase/supabase-js";

// Set these in .env.local (get them from your Supabase project settings > API):
//   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Whether real Supabase config is present. Callers (lib/data.ts) check this
// before attempting a live fetch, so the app can fall back to local data
// gracefully instead of erroring.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// IMPORTANT: createClient() throws synchronously if given an empty string,
// and Next.js pre-renders client-component pages on the server at build
// time -- a pass that doesn't have .env.local loaded unless explicitly
// configured. Without a placeholder fallback here, `next build` crashes on
// every page that imports this module whenever env vars aren't set, even
// though the actual browser runtime would have them fine. Placeholder
// values let the client construct without throwing; isSupabaseConfigured
// is what actually gates whether real data gets fetched.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
