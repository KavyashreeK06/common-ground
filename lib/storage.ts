"use client";

import { StudentProfile } from "../types";

const KEY = "campus_connections_profile";

export function saveProfile(profile: StudentProfile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // localStorage can throw outright in some private/incognito browsing
    // configurations (older Safari private mode enforced a 0-byte quota,
    // and some browsers block storage access entirely). Fail silently --
    // the app works fine without a saved profile, it just won't follow
    // the student across visits in that session.
  }
}

export function loadProfile(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentProfile;
  } catch {
    return null;
  }
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // see saveProfile
  }
}
