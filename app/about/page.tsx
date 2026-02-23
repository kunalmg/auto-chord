import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover AutoChord's mission to deliver clean, performance-ready chord sheets for musicians.",
};

const principles = ["Precision", "Speed", "Minimalism", "Accessibility"];

export default function AboutPage() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="About AutoChord"
          title="A premium music-tech engine for performance-ready chord sheets"
          subtitle="AutoChord is a modern music-tech tool designed to give musicians clean, accurate, performance-ready chord sheets."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <h3 className="text-xl font-semibold text-white">Brand Statement</h3>
            <p className="mt-4 text-sm text-white/70">
              AutoChord is built for creators who want an elegant, reliable way
              to prepare songs. It blends precise alignment, transposition, and
              a distraction-free UI into a single premium workflow.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-xl font-semibold text-white">Vision</h3>
            <p className="mt-4 text-sm text-white/70">
              A single place where guitarists, vocalists, and creators prepare
              songs faster with professional-grade formatting.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {principles.map((principle) => (
                <span
                  key={principle}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70"
                >
                  {principle}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h3 className="text-xl font-semibold text-white">Team</h3>
          <p className="mt-4 text-sm text-white/70">
            A focused product and design team dedicated to modern music
            workflows. Team details available upon request.
          </p>
        </div>
      </Container>
    </section>
  );
}
