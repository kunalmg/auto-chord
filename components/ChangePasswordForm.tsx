"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function change() {
    setMsg(null);
    if (newPassword.length < 6) {
      setMsg("New password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(data.error || "Change failed");
      } else {
        setMsg("Password changed");
        setCurrentPassword("");
        setNewPassword("");
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
        <label className="text-sm text-white/70">Current Password</label>
        <input
          type="password"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
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
        onClick={change}
        disabled={submitting}
        className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black disabled:opacity-60"
      >
        {submitting ? "Changing…" : "Change Password"}
      </button>
      {msg ? <div className="text-xs text-white/70">{msg}</div> : null}
    </div>
  );
}

