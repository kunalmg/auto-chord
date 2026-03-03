"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function SongForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [body, setBody] = useState("");
  const [keyScale, setKeyScale] = useState("");
  const [capo, setCapo] = useState<number | "">("");
  const [difficulty, setDifficulty] = useState("");
  const [tempo, setTempo] = useState<number | "">("");
  const [strumming, setStrumming] = useState("");
  const [tuning, setTuning] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [progression, setProgression] = useState("");
  const [youtube, setYoutube] = useState("");
  const [reference, setReference] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [formatted, setFormatted] = useState("");
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
      const result = await apiFetch<{ id: number }>("/api/songs", {
        method: "POST",
        body: JSON.stringify({
          title,
          artist: artist || null,
          body: body || null,
          key_scale: keyScale || null,
          capo: capo === "" ? null : Number(capo),
          difficulty: difficulty || null,
          tempo: tempo === "" ? null : Number(tempo),
          strumming_pattern: strumming || null,
          tuning: tuning || null,
          genre: genre || null,
          tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
          description: description || null,
          chord_progression: progression || null,
          youtube_link: youtube || null,
          reference_link: reference || null,
          formatted: formatted || null,
          release_date: releaseDate || null,
        }),
      });
      if (!result.ok) {
        setMsg(result.error || "Failed to save");
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
    <div className="space-y-6">
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
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm text-white/70">Key / Scale</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            value={keyScale}
            onChange={(e) => setKeyScale(e.target.value)}
            placeholder="e.g., A Major"
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Capo</label>
          <input
            type="number"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            value={capo}
            onChange={(e) => setCapo(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Difficulty</label>
          <select
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Select</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm text-white/70">Tempo (BPM)</label>
          <input
            type="number"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            value={tempo}
            onChange={(e) => setTempo(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="96"
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Strumming Pattern</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            value={strumming}
            onChange={(e) => setStrumming(e.target.value)}
            placeholder="D D U U D U"
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Tuning</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            value={tuning}
            onChange={(e) => setTuning(e.target.value)}
            placeholder="Standard / Drop D"
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm text-white/70">Genre</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Rock, Pop"
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Tags</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="comma,separated,tags"
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Release Date</label>
          <input
            type="date"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="text-sm text-white/70">Description / Story</label>
        <textarea
          className="mt-2 h-28 w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Story behind the song..."
        />
      </div>
      <div>
        <label className="text-sm text-white/70">Chord Progression</label>
        <input
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
          value={progression}
          onChange={(e) => setProgression(e.target.value)}
          placeholder="e.g., I - V - vi - IV"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-white/70">YouTube Link</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            placeholder="https://youtu.be/..."
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Reference Link</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Original source link"
          />
        </div>
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
      <div>
        <label className="text-sm text-white/70">Formatted (Markdown)</label>
        <textarea
          className="mt-2 h-60 w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white outline-none"
          value={formatted}
          onChange={(e) => setFormatted(e.target.value)}
          placeholder="Optional advanced formatted sheet (Markdown)"
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
