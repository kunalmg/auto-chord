"use client";

import { useState } from "react";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setMsg(null);
    if (newPassword.length < 6) {
      setMsg("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(data.error || "Reset failed");
      } else {
        setMsg("Password reset. You can now sign in.");
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
        <label className="text-sm text-white/70">New Password</label>
        <input
          type="password"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <button
        onClick={submit}
        disabled={submitting}
        className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black disabled:opacity-60"
      >
        {submitting ? "Resetting…" : "Reset Password"}
      </button>
      {msg ? <div className="text-xs text-white/70">{msg}</div> : null}
    </div>
  );
}

