import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeId } from "../lib/sanitize-id.mjs";

test("sanitizeId accepts clean numeric ids", () => {
  assert.equal(sanitizeId("9"), 9);
  assert.equal(sanitizeId(" 9 "), 9);
  assert.equal(sanitizeId("09"), 9);
});

test("sanitizeId rejects invalid ids", () => {
  const bad = ["9/1", "", " ", undefined, null, "undefined", "NaN", "%0A", "0", "-1"];
  for (const v of bad) {
    assert.equal(sanitizeId(v), null);
  }
});

test("sanitizeId tolerates invisible non-digits around a valid number", () => {
  // Insert zero width joiner and newline around 9
  const zwnj = "\u200C";
  const input = `${zwnj} 9 %0A`;
  assert.equal(sanitizeId(input), 9);
});
