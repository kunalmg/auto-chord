import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore AutoChord's premium features for aligned chord sheets, transposition, and performance-ready UI.",
};

const features = [
  {
    title: "Smart Chord Formatting",
    detail:
      "Automatic chord placement above lyrics, perfectly aligned for live performance.",
    example: "Alignment stays locked to each lyric line.",
  },
  {
    title: "Instant Key Transposition",
    detail:
      "Transpose the entire sheet by semitone without losing structure.",
    example: "Tap +/- to shift keys in real time.",
  },
  {
    title: "Minimal, Performance-Ready UI",
    detail:
      "Clean layouts for stage and studio sessions with zero distractions.",
    example: "Designed for fast reading and clarity.",
  },
  {
    title: "Mobile-First Song Viewer",
    detail:
      "Perfect alignment on small screens with large, readable lyrics.",
    example: "Responsive typography keeps lines intact.",
  },
  {
    title: "Customization (UI Only)",
    detail:
      "Toggle layout modes, adjust font sizes, and manage contrast.",
    example: "Personalize every sheet instantly.",
  },
];

export default function FeaturesPage() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Core Capabilities"
          title="Premium tools for modern musicians"
          subtitle="Every feature is crafted to feel like a professional music-tech SaaS product."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {features.map((feature) => (
            <GlassCard key={feature.title}>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-lime-300 via-cyan-300 to-yellow-300 text-black" />
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/70">
                    {feature.detail}
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50">
                    {feature.example}
                  </p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
