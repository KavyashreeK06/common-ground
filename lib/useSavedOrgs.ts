"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "./auth";
import { fetchSavedOrgIds, saveOrgToCloud, unsaveOrgFromCloud } from "./data";

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
      }
      if (!cancelled) setLoaded(true);
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleSave(orgId: string) {
    if (!userId) return;
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(orgId)) {
        next.delete(orgId);
        unsaveOrgFromCloud(userId, orgId);
      } else {
        next.add(orgId);
        saveOrgToCloud(userId, orgId, universityId);
      }
      return next;
    });
  }

  return { savedIds, toggleSave, loaded, signedIn: userId !== null };
}
