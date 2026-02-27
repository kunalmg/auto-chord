import type { Metadata } from "next";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import SongForm from "@/components/SongForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "New Sheet",
  description: "Create a new chord sheet",
};

export default async function NewSheetPage() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  if (!verifyToken(token)) {
    redirect("/signin");
  }
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Chord Sheets"
          title="Create a new sheet"
          subtitle="Add a title, optional artist, and your chords + lyrics."
        />
        <div className="mt-12 flex justify-center">
          <GlassCard className="w-full max-w-3xl">
            <SongForm />
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}

