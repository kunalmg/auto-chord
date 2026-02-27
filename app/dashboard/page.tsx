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
            <p className="mt-3 text-sm text-white/70">Explore features and create your first chord sheet.</p>
            <div className="mt-4">
              <a
                href="/sheets/new"
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-black"
              >
                New Sheet
              </a>
              <a
                href="/sheets"
                className="ml-3 inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white"
              >
                View Sheets
              </a>
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="text-xl font-semibold text-white">Account</h3>
            <p className="mt-3 text-sm text-white/70">Manage your details and preferences.</p>
            <div className="mt-4">
              <a
                href="/profile"
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-black"
              >
                Manage Account
              </a>
            </div>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
