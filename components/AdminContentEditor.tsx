"use client";

import { useEffect, useState } from "react";

type Content = {
  siteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
};

export default function AdminContentEditor() {
  const [content, setContent] = useState<Content | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((d) => setContent(d.data))
      .catch(() => setContent(null));
  }, []);

  function update<K extends keyof Content>(key: K, value: string) {
    if (!content) return;
    setContent({ ...content, [key]: value });
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(data.error || "Save failed");
      } else {
        setMsg("Saved");
      }
    } catch {
      setMsg("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (!content) {
    return <div className="text-white/70">Loading…</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm text-white/70">Site Title</label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          value={content.siteTitle}
          onChange={(e) => update("siteTitle", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm text-white/70">Hero Title</label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          value={content.heroTitle}
          onChange={(e) => update("heroTitle", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm text-white/70">Hero Subtitle</label>
        <textarea
          rows={3}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          value={content.heroSubtitle}
          onChange={(e) => update("heroSubtitle", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm text-white/70">CTA Text</label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
          value={content.ctaText}
          onChange={(e) => update("ctaText", e.target.value)}
        />
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save"}
      </button>
      {msg ? (
        <div className="text-xs text-white/70">{msg}</div>
      ) : null}
    </div>
  );
}

