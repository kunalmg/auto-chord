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
  // Tolerate stray invisible/control whitespace characters only
  // Remove: ASCII controls, DEL range, zero-width chars, BOM, and all whitespace
  const invisibles = /[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF\s]+/g;
  const digitsOnly = cleaned.replace(invisibles, "");
  if (!digitsOnly) return null;
  const num = Number(digitsOnly);
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
