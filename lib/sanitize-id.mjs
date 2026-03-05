export function safeDecode(input) {
  try {
    return decodeURIComponent(String(input ?? ""));
  } catch {
    return String(input ?? "");
  }
}

export function sanitizeId(input) {
  const raw = safeDecode(input);
  const cleaned = String(raw).trim();
  if (!cleaned) return null;
  if (!/^\d+$/.test(cleaned)) return null;
  const num = Number(cleaned);
  if (!Number.isSafeInteger(num) || num <= 0) return null;
  return num;
}

export function explainSanitizeId(input) {
  const id = sanitizeId(input);
  if (id == null) {
    return { ok: false, error: "Invalid id" };
  }
  return { ok: true, id };
}
