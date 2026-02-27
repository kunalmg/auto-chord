"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SongForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setMsg(null);
    if (!title.trim()) {
      setMsg("Title is required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, artist: artist || null, body: body || null }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(data.error || "Failed to save");
      } else {
        router.push("/sheets");
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
        <label className="text-sm text-white/70">Title</label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Song title"
        />
      </div>
      <div>
        <label className="text-sm text-white/70">Artist</label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist (optional)"
        />
      </div>
      <div>
        <label className="text-sm text-white/70">Chord Sheet</label>
        <textarea
          className="mt-2 h-60 w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none transition focus:border-white/30"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Paste or type chords + lyrics here..."
        />
      </div>
      <button
        onClick={submit}
        disabled={submitting}
        className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black disabled:opacity-60"
      >
        {submitting ? "Saving…" : "Save Sheet"}
      </button>
      {msg ? <div className="text-xs text-white/70">{msg}</div> : null}
    </div>
  );
}

