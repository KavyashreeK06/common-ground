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

const SAVED_KEY = "campus_connections_saved_orgs";

export function loadSavedOrgIds(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(SAVED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrgIdLocally(orgId: string) {
  if (typeof window === "undefined") return;
  const ids = new Set(loadSavedOrgIds());
  ids.add(orgId);
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(ids)));
}

export function unsaveOrgIdLocally(orgId: string) {
  if (typeof window === "undefined") return;
  const ids = new Set(loadSavedOrgIds());
  ids.delete(orgId);
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(Array.from(ids)));
}
