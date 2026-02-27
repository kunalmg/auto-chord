import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";

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
            <ContactForm />
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
