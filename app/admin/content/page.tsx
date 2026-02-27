import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import AdminContentEditor from "@/components/AdminContentEditor";
import { verifyToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Content",
  description: "Edit site content",
};

async function canEdit() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const payload = verifyToken(token);
  return !!payload && payload.r === "admin";
}

export default async function AdminContentPage() {
  const ok = await canEdit();
  if (!ok) {
    redirect("/login");
  }
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Admin"
          title="Content editor"
          subtitle="Update hero text and CTA"
          align="center"
        />
        <div className="mt-12 flex justify-center">
          <GlassCard className="w-full max-w-2xl">
            <AdminContentEditor />
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}

