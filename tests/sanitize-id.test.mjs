import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeId } from "../lib/sanitize-id.mjs";

test("sanitizeId accepts clean numeric ids", () => {
  assert.equal(sanitizeId("9"), 9);
  assert.equal(sanitizeId(" 9 "), 9);
  assert.equal(sanitizeId("09"), 9);
});

test("sanitizeId rejects invalid ids", () => {
  const bad = ["9a", "9/1", "", " ", undefined, null, "undefined", "NaN", "%0A", "0", "-1"];
  for (const v of bad) {
    assert.equal(sanitizeId(v), null);
  }
});
