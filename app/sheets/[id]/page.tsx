import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import { CHORDS, detectChords } from "@/lib/chords";
import { apiFetch } from "@/lib/api";
import ChordDiagram from "@/components/ChordDiagram";

export const metadata: Metadata = {
  title: "Sheet",
  description: "Song sheet details",
};

type Sheet = {
  id: number;
  title: string;
  artist: string | null;
  key?: string | null;
  key_scale?: string | null;
  capo?: number | null;
  difficulty?: string | null;
  tempo?: number | null;
  tuning?: string | null;
  genre?: string | null;
  tags?: string[] | null;
  description?: string | null;
  strumming_pattern?: string | null;
  chord_progression?: string | null;
  body?: string | null;
  formatted?: string | null;
  sheet_body?: string | null;
  created_at: string;
  updated_at?: string | null;
  owner_id?: number | null;
  youtube_link?: string | null;
  reference_link?: string | null;
  release_date?: string | null;
};

async function getSheet(id: string) {
  const result = await apiFetch<Sheet>(`/api/songs/${id}`, { cache: "no-store" } as RequestInit);
  if (!result.ok) return null;
  return result.data;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="mr-2 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
      {children}
    </span>
  );
}

export default async function SheetPage({ params }: { params: { id: string } }) {
  const item = await getSheet(params.id);
  if (!item) {
    return (
      <section className="py-20">
        <Container>
          <p className="text-white/70">Sheet not found</p>
        </Container>
      </section>
    );
  }
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Song"
          title={`${item.title} — ${item.artist ?? "Unknown artist"}`}
          subtitle="Chord sheet"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <GlassCard className="lg:col-span-2">
            <div className="flex flex-wrap">
              <Pill>Key: {item.key ?? item.key_scale ?? "—"}</Pill>
              <Pill>Capo: {item.capo ?? "—"}</Pill>
              <Pill>Difficulty: {item.difficulty ?? "—"}</Pill>
              <Pill>Tuning: {item.tuning ?? "—"}</Pill>
              <Pill>Tempo: {item.tempo ?? "—"} BPM</Pill>
            </div>
            {item.strumming_pattern ? (
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white">Strumming</h3>
                <p className="mt-1 text-sm text-white/70">{item.strumming_pattern}</p>
              </div>
            ) : null}
            {item.chord_progression ? (
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white">Chord Progression</h3>
                <p className="mt-1 font-mono text-sm text-white/80">{item.chord_progression}</p>
              </div>
            ) : null}
            <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
              <h3 className="text-sm font-semibold text-white">Chord Sheet</h3>
              <pre className="mt-3 whitespace-pre-wrap font-mono text-sm leading-6 text-white/90">
                {item.sheet_body || item.formatted || item.body || "No sheet added yet."}
              </pre>
            </div>
            {(item.youtube_link || item.reference_link) ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {item.youtube_link ? (
                  <a href={item.youtube_link} className="underline" target="_blank">
                    YouTube
                  </a>
                ) : null}
                {item.reference_link ? (
                  <a href={item.reference_link} className="underline" target="_blank">
                    Reference
                  </a>
                ) : null}
              </div>
            ) : null}
            <p className="mt-6 text-xs text-white/50">
              Created: {new Date(item.created_at).toLocaleString()} • Updated:{" "}
              {item.updated_at ? new Date(item.updated_at).toLocaleString() : "—"}
            </p>
          </GlassCard>
          <div className="space-y-6">
            {item.description ? (
              <GlassCard>
                <h3 className="text-sm font-semibold text-white">Description</h3>
                <p className="mt-2 text-sm text-white/70">{item.description}</p>
              </GlassCard>
            ) : null}
            <GlassCard>
              <h3 className="text-sm font-semibold text-white">Metadata</h3>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/70">
                <div>Genre</div>
                <div>{item.genre ?? "—"}</div>
                <div>Tags</div>
                <div>{(item.tags ?? []).join(", ")}</div>
                <div>Release</div>
                <div>{item.release_date ?? "—"}</div>
              </div>
            </GlassCard>
          </div>
          <div>
            <GlassCard>
              <h3 className="text-sm font-semibold text-white">Chord Diagrams</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(() => {
                  const text = [item.formatted, item.body, item.chord_progression].filter(Boolean).join("\n");
                  const names = detectChords(text);
                  const known = names.filter((n) => CHORDS[n]);
                  if (known.length === 0) {
                    return <p className="text-xs text-white/60">No chords detected</p>;
                  }
                  return known.map((n) => (
                    <ChordDiagram key={n} name={n} fingering={CHORDS[n]} />
                  ));
                })()}
              </div>
            </GlassCard>
          </div>
        </div>
      </Container>
    </section>
  );
}
