import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact AutoChord for product access, partnerships, or feature requests.",
};

export default function ContactPage() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Contact"
          title="Get in touch with AutoChord"
          subtitle="Reach out for access, partnerships, or feature requests."
          align="center"
        />
        <div className="mt-12 flex justify-center">
          <GlassCard className="w-full max-w-xl">
            <form className="space-y-5">
              <div>
                <label className="text-sm text-white/70">Name</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Email</label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Message</label>
                <textarea
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-full bg-gradient-to-r from-lime-300 via-cyan-300 to-white px-6 py-3 text-sm font-semibold text-black transition hover:shadow-[0_0_25px_rgba(76,231,255,0.45)]"
              >
                Send Message
              </button>
            </form>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
