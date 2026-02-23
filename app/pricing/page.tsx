import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the AutoChord plan that fits your rehearsal and performance workflow.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    highlight: "Basic chord viewer",
    features: [
      "Aligned lyric preview",
      "Limited transposition",
      "Standard viewer mode",
    ],
  },
  {
    name: "Plus",
    price: "$12",
    highlight: "Unlimited transposition",
    features: [
      "Unlimited key changes",
      "Faster sheet rendering",
      "Saved recent songs",
    ],
  },
  {
    name: "Pro",
    price: "$24",
    highlight: "Full musician toolkit",
    features: [
      "Performance mode",
      "Custom layouts + fonts",
      "Setlist manager",
    ],
  },
];

export default function PricingPage() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Pricing"
          title="Plans built for every session"
          subtitle="Pure UI preview. No payment integration included."
          align="center"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <GlassCard
              key={plan.name}
              className={
                index === 1
                  ? "border-cyan-300/40 shadow-[0_0_40px_rgba(76,231,255,0.25)]"
                  : ""
              }
            >
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                  {plan.name}
                </p>
                <div className="text-4xl font-semibold text-white">
                  {plan.price}
                  <span className="text-base text-white/60">/mo</span>
                </div>
                <p className="text-sm text-white/70">{plan.highlight}</p>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mt-4 w-full rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/40 hover:bg-white/10"
                >
                  Select {plan.name}
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
