"use client";

import { useState } from "react";

export default function RequestResetForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setMsg(null);
    setDevLink(null);
    if (!email) {
      setMsg("Enter your email");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(data.error || "Request failed");
      } else {
        setMsg("If your email exists, a reset link has been sent.");
        if (data.resetUrl) setDevLink(data.resetUrl);
      }
    } catch {
      setMsg("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Email</label>
        <input
          type="email"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <button
        onClick={submit}
        disabled={submitting}
        className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send Reset Link"}
      </button>
      {msg ? <div className="text-xs text-white/70">{msg}</div> : null}
      {devLink ? (
        <div className="text-xs text-emerald-300">
          Dev link:&nbsp;
          <a href={devLink} className="underline">
            {devLink}
          </a>
        </div>
      ) : null}
    </div>
  );
}

