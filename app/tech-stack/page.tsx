import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Tech Stack",
  description:
    "AutoChord uses a modern, scalable stack built on Next.js, Node.js, and MongoDB.",
};

const stacks = [
  {
    title: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    detail:
      "Delivers fast, SEO-ready interfaces with a consistent design system.",
  },
  {
    title: "Backend",
    items: ["Node.js", "Express"],
    detail: "Handles search logic, alignment processing, and API orchestration.",
  },
  {
    title: "Database",
    items: ["MongoDB"],
    detail: "Stores cached song sheets and user library data efficiently.",
  },
  {
    title: "External APIs",
    items: ["Lyrics API", "Chords API"],
    detail: "Fetches accurate, up-to-date content for each song request.",
  },
  {
    title: "Tools",
    items: ["Git", "VS Code", "Postman"],
    detail: "Supports agile collaboration, testing, and rapid iteration.",
  },
];

export default function TechStackPage() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Technology"
          title="Modern stack, academic rigor"
          subtitle="Every layer was chosen to keep the project maintainable, scalable, and deployment-ready."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {stacks.map((stack) => (
            <GlassCard key={stack.title}>
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-white">
                  {stack.title}
                </h3>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-lime-300 via-cyan-300 to-yellow-300 text-black" />
              </div>
              <p className="mt-3 text-sm text-white/70">{stack.detail}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {stack.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
