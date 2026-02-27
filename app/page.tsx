import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default async function Home() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  try {
    const payload = verifyToken(token);
    if (payload) {
      redirect("/dashboard");
      return;
    }
  } catch {}
  redirect("/signin");
}
