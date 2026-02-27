import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import RequestResetForm from "@/components/RequestResetForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Request a password reset link",
};

export default function ResetRequestPage() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Account"
          title="Reset your password"
          subtitle="Enter your email to receive a reset link"
          align="center"
        />
        <div className="mt-12 flex justify-center">
          <GlassCard className="w-full max-w-md">
            <RequestResetForm />
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}

