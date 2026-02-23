import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-8 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur">
          <div className="flex flex-col justify-between gap-6 text-sm text-white/60 md:flex-row md:items-center">
            <div className="space-y-2">
              <p className="text-base font-semibold text-white">
                AUTOCHORD — Intelligent Guitar Chords & Lyrics Engine
              </p>
              <p>Premium music-tech tooling for clean, playable sheets.</p>
            </div>
            <div className="space-y-1 text-left md:text-right">
              <p>Built for modern performers and creators.</p>
              <p>Next.js · TypeScript · Tailwind CSS</p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
