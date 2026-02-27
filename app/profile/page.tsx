import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import { verifyToken } from "@/lib/auth";
import ProfileForm from "@/components/ProfileForm";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your account",
};

async function canView() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const payload = verifyToken(token);
  return !!payload;
}

export default async function ProfilePage() {
  const ok = await canView();
  if (!ok) redirect("/signin");
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          kicker="Account"
          title="Your profile"
          subtitle="Update your details and password"
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <GlassCard>
            <h3 className="text-xl font-semibold text-white">Profile</h3>
            <div className="mt-4">
              <ProfileForm />
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="text-xl font-semibold text-white">Change password</h3>
            <div className="mt-4">
              <ChangePasswordForm />
            </div>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}

