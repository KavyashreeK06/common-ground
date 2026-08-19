"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, onAuthChange } from "../lib/auth";
import { UNIVERSITIES } from "../data/universities";
import { SchoolFlag } from "./SchoolFlag";
import { loadProfile } from "../lib/storage";

export default function Nav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
    const unsubscribe = onAuthChange(setUser);
    return unsubscribe;
  }, []);

  // Figure out which school we're currently "in", checked in priority
  // order since different pages carry that info differently:
  //  1. Path segment, e.g. /school/nyu/clubs -- most explicit, current-page choice.
  //  2. This page's own query string, e.g. /quiz?school=nyu.
  //  3. The locally saved quiz profile's school -- covers pages like /results
  //     that don't put the school in their own URL at all. Deliberately
  //     skipped on the homepage itself ("/") -- that page's whole purpose is
  //     showing the neutral "choose your school" state, so a stale saved
  //     profile from a past visit shouldn't make it silently assume a school.
  const segments = pathname.split("/").filter(Boolean);
  const isHomepage = pathname === "/";
  const pathSchoolId = segments[0] === "school" && UNIVERSITIES.some((u) => u.id === segments[1])
    ? segments[1]
    : null;

  const queryParam = searchParams.get("school");
  const querySchoolId = queryParam && UNIVERSITIES.some((u) => u.id === queryParam) ? queryParam : null;

  const [profileSchoolId, setProfileSchoolId] = useState<string | null>(null);
  useEffect(() => {
    const profile = loadProfile();
    setProfileSchoolId(profile?.universityId ?? null);
  }, [pathname]);

  const schoolId = pathSchoolId ?? querySchoolId ?? (isHomepage ? null : profileSchoolId);
  const currentSchool = schoolId ? UNIVERSITIES.find((u) => u.id === schoolId) ?? null : null;

  const LINKS = schoolId
    ? [
        { href: "/", label: "Home" },
        { href: `/quiz?school=${schoolId}`, label: "Quiz" },
        { href: `/school/${schoolId}/belonging`, label: "Belonging" },
        { href: `/school/${schoolId}/clubs`, label: "Clubs" },
        { href: `/school/${schoolId}/events`, label: "Events" },
      ]
    : [{ href: "/", label: "Home" }];

  return (
    <nav className="nav">
      <Link href="/" className="nav-brand">Common Ground</Link>
      {currentSchool && (
        <span
          className="school-chip"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, marginRight: 20, fontSize: 13, color: "var(--ink-soft)", fontWeight: 500 }}
        >
          <SchoolFlag color={currentSchool.color} accentColor={currentSchool.accentColor} size={13} />
          {currentSchool.shortName}
        </span>
      )}
      {LINKS.map((l) => (
        <Link
          key={l.label}
          href={l.href}
          className={`nav-link ${pathname === l.href.split("?")[0] ? "active" : ""}`}
        >
          {l.label}
        </Link>
      ))}
      {(user || schoolId) && (
        <Link
          href={schoolId ? `/account?school=${schoolId}` : "/account"}
          className={`nav-link ${pathname === "/account" ? "active" : ""}`}
          style={{ marginLeft: "auto" }}
        >
          {user ? "Account" : "Sign in"}
        </Link>
      )}
    </nav>
  );
}
