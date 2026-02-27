"use client";

import { useEffect, useState } from "react";

export default function ProfileForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setEmail(d.data.email);
          setUsername(d.data.username);
        }
      });
  }, []);

  async function saveProfile() {
    setStatus(null);
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setStatus(data.error || "Update failed");
    } else {
      setStatus("Profile updated");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Email</label>
        <input
          disabled
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          value={email}
          readOnly
        />
      </div>
      <div>
        <label className="text-sm text-white/70">Username</label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <button
        onClick={saveProfile}
        className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black"
      >
        Save
      </button>
      {status ? <div className="text-xs text-white/70">{status}</div> : null}
    </div>
  );
}

