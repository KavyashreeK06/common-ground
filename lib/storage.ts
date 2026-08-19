"use client";

import { StudentProfile } from "../types";

const KEY = "campus_connections_profile";

export function saveProfile(profile: StudentProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(profile));
}

export function loadProfile(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudentProfile;
  } catch {
    return null;
  }
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
