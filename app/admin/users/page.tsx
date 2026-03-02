import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import { verifyToken } from "@/lib/auth";
import AdminUsersTable from "@/components/AdminUsersTable";

export const metadata: Metadata = {
  title: "Manage Users",
  description: "Admin — manage users",
};

export default async function AdminUsersPage() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const payload = verifyToken(token);
  if (!payload || payload.r !== "admin") {
    redirect("/login");
  }
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Admin"
          title="Manage Users"
          subtitle="View, rename, reset password, or delete users."
          align="center"
        />
        <div className="mt-12">
          <GlassCard>
            <AdminUsersTable />
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}

