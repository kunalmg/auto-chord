import Link from "next/link";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="flex flex-col items-center text-center">
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
          404 Error
        </div>
        <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">
          This track is missing.
        </h1>
        <p className="mt-4 max-w-xl text-white/70">
          The page you requested couldn’t be found. Head back to the home
          stage, or launch the demo to keep exploring.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:shadow-[0_0_25px_rgba(255,255,255,0.35)]"
          >
            Back to Home
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
          >
            Launch Demo
          </Link>
        </div>
      </Container>
    </section>
  );
}
