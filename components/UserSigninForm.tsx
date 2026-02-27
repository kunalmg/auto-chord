"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserSigninForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Enter email and password");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Network error");
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
      </div>
      <div>
        <label className="text-sm text-white/70">Password</label>
        <input
          type="password"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gradient-to-r from-lime-300 via-cyan-300 to-white px-6 py-3 text-sm font-semibold text-black transition hover:shadow-[0_0_25px_rgba(76,231,255,0.45)] disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign In"}
      </button>
      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-xs text-red-200">
          {error}
        </div>
      ) : null}
    </form>
  );
}

