import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import "server-only";
import { cache } from "react";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin panel",
};

async function getUser() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const payload = verifyToken(token);
  if (!payload || payload.r !== "admin") return null;
  return payload.u;
}

const getMetrics = cache(async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/metrics`, {
      cache: "no-store",
    });
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
});

export default async function AdminPage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  const metrics = await getMetrics();
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Admin"
          title="Control panel"
          subtitle="Private area"
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <GlassCard>
            <h3 className="text-xl font-semibold text-white">Welcome</h3>
            <p className="mt-3 text-sm text-white/70">Signed in as {user}</p>
            <div className="mt-4">
              <Link
                href="/admin/content"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
              >
                Edit Content
              </Link>
            </div>
            <form className="mt-6" action="/api/auth/logout" method="post">
              <button
                className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
                type="submit"
              >
                Sign out
              </button>
            </form>
          </GlassCard>
          <GlassCard>
            <h3 className="text-xl font-semibold text-white">Status</h3>
            {metrics ? (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-white/80">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-white/60">Requests Today</div>
                  <div className="mt-1 text-2xl font-semibold">{metrics.requestsToday}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-white/60">Contact Submissions</div>
                  <div className="mt-1 text-2xl font-semibold">{metrics.contactSubmissions}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-white/60">Uptime (min)</div>
                  <div className="mt-1 text-2xl font-semibold">{metrics.uptimeMinutes}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-white/60">Server Time</div>
                  <div className="mt-1 text-xs">{metrics.time}</div>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-white/70">Metrics unavailable</p>
            )}
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
