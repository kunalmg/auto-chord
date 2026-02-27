import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import SongSheetPreview from "@/components/SongSheetPreview";

export default function Home() {
  return (
    <div>
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
              Premium Music-Tech Engine
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Your Guitar. Your Key. Your Song — Instantly.
            </h1>
            <p className="text-lg text-white/70">
              AUTOCHORD generates perfectly aligned chords + lyrics with clean
              formatting and instant transposition.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="/features"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-lime-300 via-cyan-300 to-white px-6 py-3 text-sm font-semibold text-black transition hover:shadow-[0_0_30px_rgba(76,231,255,0.5)]"
              >
                Get Started
              </a>
              <a
                href="/features"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
              >
                Explore Features
              </a>
            </div>
          </div>
          <div className="animate-fade-up">
            <div className="animate-float-soft">
              <SongSheetPreview />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading
            kicker="Value Proposition"
            title="Made for precision and performance"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Accurate Chord Alignment",
              "Instant Key Transpose",
              "Clean, Distraction-Free Layout",
              "Optimized For Musicians",
            ].map((feature) => (
              <GlassCard key={feature}>
                <div className="mb-4 h-10 w-10 rounded-full bg-gradient-to-br from-lime-300 via-cyan-300 to-white text-black" />
                <p className="text-lg font-medium text-white">{feature}</p>
                <p className="mt-3 text-sm text-white/60">
                  Premium clarity that keeps every line performance-ready.
                </p>
              </GlassCard>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading
            kicker="Product Preview"
            title="A command center for chord sheets"
            subtitle="A wide, focused workspace for alignment, transposition, and performance mode."
          />
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Now Playing
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  Midnight Signal
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Key: C# Minor · Tempo: 96 BPM · Mode: Performance
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {["Transpose -", "Transpose +", "Night Mode", "Font Size"]
                  .map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/70"
                    >
                      {item}
                    </span>
                  ))}
              </div>
            </div>
            <div className="mt-8 grid gap-4 font-mono text-lg text-white/80 sm:text-xl">
              <div className="flex items-start gap-4">
                <span className="text-cyan-200">C#m</span>
                <span>Hold the tone, let it breathe tonight</span>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-lime-200">A</span>
                <span>Every line aligns before the light</span>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-cyan-200">E</span>
                <span>Signals rise and find the perfect key</span>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-lime-200">B</span>
                <span>Clean and steady, built for harmony</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading kicker="Why AutoChord" title="Built for the stage" />
          <div className="mt-8 grid gap-4 text-sm text-white/70 md:grid-cols-2">
            {[
              "Fast lyric + chord generation with consistent formatting.",
              "Clean output designed for performers and rehearsals.",
              "Optimized for night-mode sessions and low-light venues.",
              "Built for creators, bands, and solo musicians.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-transparent p-10 text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Make Your Next Performance Smoother.
            </h2>
            <p className="mt-4 text-white/70">
              Move from search to stage-ready sheets in moments.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/features"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]"
              >
                Get Started
              </a>
              <a
                href="/features"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
              >
                View Features
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
