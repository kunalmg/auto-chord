import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Use Cases",
  description:
    "Explore real scenarios where AutoChord supports musicians and educators.",
};

const stories = [
  {
    title: "Guitarist preparing a setlist",
    story:
      "Maya has a 45-minute gig tonight. She searches five songs, saves them to a setlist, and prints clean sheets without ads or misaligned chords.",
  },
  {
    title: "Singer adjusting key for vocal range",
    story:
      "Arjun needs every chorus shifted up a whole step. AutoChord transposes the entire sheet instantly while preserving chord alignment.",
  },
  {
    title: "Teacher creating lesson material",
    story:
      "Professor Lane builds a lesson pack with consistent formatting. Students receive the same aligned sheets across their devices.",
  },
];

export default function UseCasesPage() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Scenarios"
          title="Stories that feel real"
          subtitle="AutoChord supports performers and educators with reliable, stage-ready sheets."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {stories.map((story) => (
            <GlassCard key={story.title}>
              <h3 className="text-xl font-semibold text-white">
                {story.title}
              </h3>
              <p className="mt-4 text-sm text-white/70">{story.story}</p>
            </GlassCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
