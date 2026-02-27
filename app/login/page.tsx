import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to access the admin panel.",
};

export default function LoginPage() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Admin"
          title="Sign in"
          subtitle="Use your admin credentials to continue."
          align="center"
        />
        <div className="mt-12 flex justify-center">
          <GlassCard className="w-full max-w-md">
            <LoginForm />
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}

