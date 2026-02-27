import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account",
};

export default function SignupPage() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Account"
          title="Create your account"
          subtitle="Sign up to access user features"
          align="center"
        />
        <div className="mt-12 flex justify-center">
          <GlassCard className="w-full max-w-md">
            <SignupForm />
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}

