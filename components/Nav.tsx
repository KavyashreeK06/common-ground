"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, onAuthChange } from "../lib/auth";
import { UNIVERSITIES } from "../data/universities";

export default function Nav() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
    const unsubscribe = onAuthChange(setUser);
    return unsubscribe;
  }, []);

  const segments = pathname.split("/").filter(Boolean);
  const inSchoolContext = segments[0] === "school" && UNIVERSITIES.some((u) => u.id === segments[1]);
  const schoolId = inSchoolContext ? segments[1] : null;

  const LINKS = [
    { href: "/", label: "Home" },
    { href: schoolId ? `/quiz?school=${schoolId}` : "/", label: "Quiz" },
    { href: schoolId ? `/school/${schoolId}/belonging` : "/", label: "Belonging" },
    { href: schoolId ? `/school/${schoolId}/clubs` : "/", label: "Clubs" },
    { href: schoolId ? `/school/${schoolId}/events` : "/", label: "Events" },
  ];

  return (
    <nav className="nav">
      <Link href="/" className="nav-brand">Common Ground</Link>
      {LINKS.map((l) => (
        <Link
          key={l.label}
          href={l.href}
          className={`nav-link ${pathname === l.href.split("?")[0] ? "active" : ""}`}
        >
          {l.label}
        </Link>
      ))}
      <Link
        href="/account"
        className={`nav-link ${pathname === "/account" ? "active" : ""}`}
        style={{ marginLeft: "auto" }}
      >
        {user ? "Account" : "Sign in"}
      </Link>
    </nav>
  );
}
