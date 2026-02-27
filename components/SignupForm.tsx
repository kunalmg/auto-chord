"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "checking" | "available" | "taken">(
    "idle"
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      setEmailStatus("idle");
      return;
    }
    setEmailStatus("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (res.ok && data.ok) {
          setEmailStatus(data.available ? "available" : "taken");
        } else {
          setEmailStatus("idle");
        }
      } catch {
        setEmailStatus("idle");
      }
    }, 400);
  }, [email]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!email || !username || !password) {
      setMsg("Fill all fields");
      return;
    }
    if (emailStatus === "taken") {
      setMsg("Email already registered");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(data.error || "Registration failed");
      } else {
        setMsg("Account created. Please sign in.");
        setTimeout(() => router.push("/signin"), 800);
      }
    } catch {
      setMsg("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm text-white/70">Email</label>
        <input
          type="email"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="mt-1 h-4 text-xs">
          {emailStatus === "checking" && (
            <span className="text-white/60">Checking availability…</span>
          )}
          {emailStatus === "available" && (
            <span className="text-emerald-300">Email available</span>
          )}
          {emailStatus === "taken" && (
            <span className="text-red-300">Email already registered</span>
          )}
        </div>
      </div>
      <div>
        <label className="text-sm text-white/70">Username</label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm text-white/70">Password</label>
        <input
          type="password"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          placeholder="Minimum 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gradient-to-r from-lime-300 via-cyan-300 to-white px-6 py-3 text-sm font-semibold text-black transition hover:shadow-[0_0_25px_rgba(76,231,255,0.45)] disabled:opacity-60"
      >
        {submitting ? "Creating…" : "Create Account"}
      </button>
      {msg ? (
        <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-center text-xs text-white/80">
          {msg}
        </div>
      ) : null}
    </form>
  );
}
