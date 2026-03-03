export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<{ ok: boolean; data?: T; error?: string }> {
  const base =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "";
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    credentials: options?.credentials ?? "include",
  });
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    // ignore
  }
  const j = json as { ok?: boolean; data?: T; error?: string } | null;
  if (!j || typeof j.ok !== "boolean") {
    return { ok: false, error: "Unexpected server response" };
  }
  return j as { ok: boolean; data?: T; error?: string };
}
