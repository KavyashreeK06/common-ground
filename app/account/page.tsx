"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingPage } from "../../components/Loading";
import type { User } from "@supabase/supabase-js";
import { sendMagicLink, signOut, getCurrentUser, onAuthChange } from "../../lib/auth";
import { UNIVERSITIES } from "../../data/universities";

function AccountInner() {
  const params = useSearchParams();
  const schoolId = params.get("school");
  const school = UNIVERSITIES.find((u) => u.id === schoolId);
  const emailPlaceholder = school ? `you@${school.domain}` : "you@school.edu";

  const [user, setUser] = useState<User | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setCheckedAuth(true);
    });
    const unsubscribe = onAuthChange((u) => setUser(u));
    return unsubscribe;
  }, []);

  async function handleSendLink() {
    if (!email.trim()) return;
    setStatus("sending");
    const { error } = await sendMagicLink(email.trim());
    if (error) {
      setStatus("error");
      setErrorMsg(error);
    } else {
      setStatus("sent");
    }
  }

  if (!checkedAuth) {
    return <LoadingPage />;
  }

  if (user) {
    return (
      <main className="page">
        <h1>Your account</h1>
        <p className="subtitle">Signed in as {user.email}.</p>
        <div className="card" style={{ maxWidth: 420 }}>
          <p style={{ marginTop: 0, color: "var(--ink-soft)" }}>
            Your quiz profile now saves to your account, so it'll follow you if you retake the
            quiz on another device. Any club edits you suggest are also linked to your account.
          </p>
          {school && (
            <p style={{ marginBottom: 16 }}>
              <a href={`/school/${school.id}/saved`} style={{ color: "var(--accent)", fontWeight: 600 }}>
                View your saved organizations →
              </a>
            </p>
          )}
          <button type="button" onClick={() => signOut()}>Sign out</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>Sign in{school ? ` to ${school.shortName}` : ""}</h1>
      <p className="subtitle">
        Optional -- you can use the whole site without an account. Signing in just makes your quiz
        results follow you across devices, and links any club edits you suggest to your account.
      </p>
      <div className="card" style={{ maxWidth: 420 }}>
        {status === "sent" ? (
          <p style={{ margin: 0, color: "var(--accent)", fontWeight: 600 }}>
            Check your inbox for a sign-in link.
          </p>
        ) : (
          <>
            <input
              className="input"
              type="email"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", marginBottom: 12 }}
            />
            <button type="button" onClick={handleSendLink} disabled={status === "sending" || !email.trim()}>
              {status === "sending" ? "Sending..." : "Send sign-in link"}
            </button>
            {status === "error" && (
              <p style={{ color: "var(--terracotta)", fontSize: 13, marginTop: 10, marginBottom: 0 }}>
                {errorMsg}
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <AccountInner />
    </Suspense>
  );
}
