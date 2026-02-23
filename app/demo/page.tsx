import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "Experience a premium mock demo of AutoChord's aligned chord and lyric sheets.",
};

const songLines = [
  { chord: "Bm", lyric: "City lights keep calling out my name" },
  { chord: "G", lyric: "Every chord is holding us in place" },
  { chord: "D", lyric: "Turn the key, the harmony aligns" },
  { chord: "A", lyric: "Every line is ready for the night" },
];

export default function DemoPage() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Interactive Demo"
          title="Aligned chord sheets, performance-ready"
          subtitle="This mock experience shows how AutoChord formats lyrics, controls transposition, and keeps everything stage-ready."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.6fr_0.4fr]">
          <GlassCard className="p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Song Sheet
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  Electric Echoes
                </h3>
                <p className="mt-2 text-sm text-white/70">Artist: Nova Lane</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                  Key: D Major
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                  Tempo: 98
                </span>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span>Key</span>
                <select className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/70 transition hover:border-white/40"
                >
                  -
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/70 transition hover:border-white/40"
                >
                  +
                </button>
              </div>
            </div>
            <div className="mt-8 max-h-72 space-y-6 overflow-y-auto pr-2 font-mono text-lg text-white/80 sm:text-xl">
              {songLines.map((line) => (
                <div key={line.lyric} className="flex items-start gap-6">
                  <span className="text-cyan-200">{line.chord}</span>
                  <span>{line.lyric}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
              Smooth scroll enabled · Performance mode · High-contrast lyrics
            </div>
          </GlassCard>
          <div className="space-y-6">
            <GlassCard>
              <h4 className="text-lg font-semibold text-white">
                Performance Controls
              </h4>
              <p className="mt-3 text-sm text-white/70">
                Lock the sheet, enable night mode, and control font sizing in
                real time.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Lock Sheet", "Night Mode", "Font +", "Font -"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </GlassCard>
            <GlassCard>
              <h4 className="text-lg font-semibold text-white">Session Notes</h4>
              <p className="mt-3 text-sm text-white/70">
                Keep rehearsal notes or alternate voicings alongside the sheet
                to stay focused mid-performance.
              </p>
            </GlassCard>
          </div>
        </div>
      </Container>
    </section>
  );
}
