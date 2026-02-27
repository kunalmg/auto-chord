import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import UserSigninForm from "@/components/UserSigninForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Access your account",
};

export default function SigninPage() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Account"
          title="Sign in"
          subtitle="Welcome back"
          align="center"
        />
        <div className="mt-12 flex justify-center">
          <GlassCard className="w-full max-w-md">
            <UserSigninForm />
            <div className="mt-4 text-center text-xs text-white/70">
              <Link href="/reset/request" className="underline">
                Forgot your password?
              </Link>
            </div>
            <div className="mt-2 text-center text-xs text-white/70">
              <span>Don&apos;t have an account? </span>
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
