export declare function safeDecode(input: unknown): string;
export declare function sanitizeId(input: unknown): number | null;
export declare function explainSanitizeId(
  input: unknown
): { ok: true; id: number } | { ok: false; error: string };
