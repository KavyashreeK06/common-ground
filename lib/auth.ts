"use client";

import { supabase, isSupabaseConfigured } from "./supabase";
import type { User } from "@supabase/supabase-js";

export async function sendMagicLink(email: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) {
    return { error: "Sign-in isn't available right now -- the database connection isn't configured." };
  }
  const redirectTo = typeof window !== "undefined" ? window.location.origin + "/account" : undefined;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  return { error: error?.message ?? null };
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!isSupabaseConfigured) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => data.subscription.unsubscribe();
}
