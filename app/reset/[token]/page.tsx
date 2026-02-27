import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set New Password",
  description: "Enter a new password to complete the reset",
};

export default function ResetTokenPage({ params }: { params: { token: string } }) {
  const { token } = params;
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Account"
          title="Set a new password"
          align="center"
        />
        <div className="mt-12 flex justify-center">
          <GlassCard className="w-full max-w-md">
            <ResetPasswordForm token={token} />
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}

