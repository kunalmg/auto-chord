import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Understand the AutoChord workflow from search to formatted, cached song sheet delivery.",
};

const steps = [
  "User searches",
  "Backend checks cache",
  "Lyrics + chords APIs called",
  "Data cleaned + aligned",
  "Stored in DB",
  "Formatted sheet returned",
];

export default function HowItWorksPage() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Workflow"
          title="From query to clean song sheet"
          subtitle="AutoChord runs a precise pipeline that preserves readability, performance, and data integrity."
        />
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80"
              >
                <span>{step}</span>
                {index < steps.length - 1 ? (
                  <span className="text-white/40">→</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <h3 className="text-xl font-semibold text-white">
              Caching + Performance
            </h3>
            <p className="mt-3 text-sm text-white/70">
              Results are cached after the first fetch, reducing API calls and
              keeping popular songs instantly available. The alignment engine
              runs only when new data arrives.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-xl font-semibold text-white">
              Agile Development
            </h3>
            <p className="mt-3 text-sm text-white/70">
              The project is delivered in short sprints with iterative
              improvements, user feedback loops, and testing checkpoints at each
              module.
            </p>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
