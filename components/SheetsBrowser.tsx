"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Item = {
  id: number;
  title: string;
  artist: string | null;
  created_at: string;
  updated_at?: string | null;
  key_scale?: string | null;
  difficulty?: string | null;
  genre?: string | null;
  owner_id?: number;
};

export default function SheetsBrowser() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [q, setQ] = useState("");
  const [artist, setArtist] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [key, setKey] = useState("");
  const [genre, setGenre] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const [me, setMe] = useState<{ id: number; role: string } | null>(null);
  const [adminAll, setAdminAll] = useState(false);
  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setMe({ id: d.data.id, role: d.data.role }))
      .catch(() => setMe(null));
  }, []);
  useEffect(() => {
    const q = me?.role === "admin" && adminAll ? "?all=1" : "";
    fetch(`/api/songs${q}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setItems(d.ok ? d.data : []))
      .catch(() => setItems([]));
  }, [me?.role, adminAll]);

  const filtered = useMemo(() => {
    const list = (items ?? []).filter((it) => {
      const matchesQ =
        !q ||
        it.title.toLowerCase().includes(q.toLowerCase()) ||
        (it.artist ?? "").toLowerCase().includes(q.toLowerCase());
      const a = !artist || (it.artist ?? "").toLowerCase() === artist.toLowerCase();
      const d = !difficulty || (it.difficulty ?? "") === difficulty;
      const k = !key || (it.key_scale ?? "") === key;
      const g = !genre || (it.genre ?? "") === genre;
      return matchesQ && a && d && k && g;
    });
    return list;
  }, [items, q, artist, difficulty, key, genre]);

  async function remove(id: number) {
    if (!confirm("Delete this sheet?")) return;
    setDeleting(id);
    const res = await fetch(`/api/songs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((arr) => (arr ?? []).filter((x) => x.id !== id));
    }
    setDeleting(null);
  }

  if (!items) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/60">
            {me?.role === "admin" && (
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-cyan-300"
                  checked={adminAll}
                  onChange={(e) => setAdminAll(e.target.checked)}
                />
                <span>All Sheets (Admin)</span>
              </label>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  const artists = Array.from(new Set(items.map((i) => i.artist).filter(Boolean))) as string[];
  const keys = Array.from(new Set(items.map((i) => i.key_scale).filter(Boolean))) as string[];
  const genres = Array.from(new Set(items.map((i) => i.genre).filter(Boolean))) as string[];

  return (
    <div>
      <div className="mb-6 grid gap-3 md:grid-cols-5">
        <input
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white outline-none"
          placeholder="Search title or artist"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        >
          <option value="">All artists</option>
          {artists.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">All difficulties</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <select
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        >
          <option value="">All keys</option>
          {keys.map((k) => (
            <option key={k} value={k ?? ""}>
              {k}
            </option>
          ))}
        </select>
        <select
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g ?? ""}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:translate-y-[-2px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-baseline justify-between">
              <Link
                href={`/sheets/${item.id}`}
                className="text-lg font-semibold text-white group-hover:underline"
              >
                {item.title}
              </Link>
              <span className="text-xs text-white/50">
                {new Date(item.updated_at ?? item.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-1 text-xs text-white/60">
              {(item.artist ?? "Unknown artist")} • {(item.key_scale ?? "Key —")} •{" "}
              {(item.difficulty ?? "Difficulty —")}
            </p>
            <div className="mt-3">
              <Link
                href={`/sheets/${item.id}`}
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-white"
              >
                View
              </Link>
              {(me && (me.role === "admin" || me.id === item.owner_id)) ? (
                <button
                  onClick={() => remove(item.id)}
                  disabled={deleting === item.id}
                  className="ml-2 rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-200 disabled:opacity-60"
                >
                  {deleting === item.id ? "Deleting…" : "Delete"}
                </button>
              ) : null}
            </div>
          </div>
        ))}
        {filtered.length === 0 ? (
          <div className="text-sm text-white/60">No results</div>
        ) : null}
      </div>
    </div>
  );
}
