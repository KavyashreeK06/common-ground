"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "./auth";
import { fetchSavedOrgIds, saveOrgToCloud, unsaveOrgFromCloud } from "./data";
import { loadSavedOrgIds, saveOrgIdLocally, unsaveOrgIdLocally } from "./storage";

export function useSavedOrgs(universityId: string) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const user = await getCurrentUser();
      if (cancelled) return;
      if (user) {
        setUserId(user.id);
        const ids = await fetchSavedOrgIds(user.id);
        if (!cancelled) setSavedIds(new Set(ids));
      } else {
        setSavedIds(new Set(loadSavedOrgIds()));
      }
      if (!cancelled) setLoaded(true);
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleSave(orgId: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      const wasSaved = next.has(orgId);
      if (wasSaved) {
        next.delete(orgId);
        if (userId) unsaveOrgFromCloud(userId, orgId);
        else unsaveOrgIdLocally(orgId);
      } else {
        next.add(orgId);
        if (userId) saveOrgToCloud(userId, orgId, universityId);
        else saveOrgIdLocally(orgId);
      }
      return next;
    });
  }

  return { savedIds, toggleSave, loaded };
}
