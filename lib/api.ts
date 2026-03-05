export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<{ ok: boolean; data?: T; error?: string }> {
  const bases = [
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    "http://localhost:4000",
  ].filter(Boolean) as string[];
  let lastError: string | undefined;
  for (const base of bases) {
    try {
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
        continue;
      }
      const j = json as { ok?: boolean; data?: T; error?: string } | null;
      if (!j || typeof j.ok !== "boolean") {
        continue;
      }
      if (j.ok) {
        return j as { ok: boolean; data?: T; error?: string };
      }
      lastError = j.error || lastError;
      // If this base responded but indicates failure, try the next base.
      continue;
    } catch {
      continue;
    }
  }
  return { ok: false, error: lastError || "Unexpected server response" };
}
