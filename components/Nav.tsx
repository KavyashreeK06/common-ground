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

  const segments = pathname.split("/").filter(Boolean);
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

  const schoolId = pathSchoolId ?? querySchoolId ?? profileSchoolId;
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
