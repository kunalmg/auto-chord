import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import SheetsBrowser from "@/components/SheetsBrowser";

export const metadata: Metadata = {
  title: "Chord Sheets",
  description: "Browse your chord sheets",
};

export default async function SheetsPage() {
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
        <div className="mt-8">
          <SheetsBrowser />
        </div>
      </Container>
    </section>
  );
}
