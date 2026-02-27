import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chord Sheets",
  description: "Browse your chord sheets",
};

async function fetchSheets() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/songs`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  if (!data?.ok) return [];
  return data.data as Array<{ id: number; title: string; artist: string | null; created_at: string }>;
}

export default async function SheetsPage() {
  const items = await fetchSheets();
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Chord Sheets"
          title="Your library"
          subtitle="Create, manage, and view your chord sheets."
        />
        <div className="mt-6">
          <Link
            href="/sheets/new"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
          >
            New Sheet
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <GlassCard key={item.id}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <span className="text-xs text-white/50">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/60">{item.artist ?? "Unknown artist"}</p>
            </GlassCard>
          ))}
          {items.length === 0 ? (
            <div className="text-sm text-white/60">
              No sheets yet. Click “New Sheet” to add your first one.
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

