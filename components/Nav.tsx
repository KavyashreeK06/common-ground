"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, onAuthChange } from "../lib/auth";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/quiz", label: "Quiz" },
  { href: "/belonging", label: "Belonging" },
  { href: "/clubs", label: "Clubs" },
  { href: "/events", label: "Events" },
];

export default function Nav() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
    const unsubscribe = onAuthChange(setUser);
    return unsubscribe;
  }, []);

  return (
    <nav className="nav">
      <Link href="/" className="nav-brand">Common Ground</Link>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`nav-link ${pathname === l.href ? "active" : ""}`}
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
