import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import { verifyToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard",
};

async function getUser() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const payload = verifyToken(token);
  if (!payload) return null;
  return { username: payload.u, role: payload.r };
}

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect("/signin");
  }
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Dashboard"
          title={`Welcome ${user.username}`}
          subtitle={`You are signed in as ${user.role}`}
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <GlassCard>
            <h3 className="text-xl font-semibold text-white">Getting Started</h3>
            <p className="mt-3 text-sm text-white/70">
              Explore features and create your first chord sheet.
            </p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-xl font-semibold text-white">Account</h3>
            <p className="mt-3 text-sm text-white/70">
              Manage your details and preferences (coming soon).
            </p>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}

