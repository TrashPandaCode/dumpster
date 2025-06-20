import { describe, expect, test } from "bun:test";

import {
  COMPUTE,
  INPUTS,
  TYPES,
} from "~/lib/node-editor/nodes/math-float/types";

describe("Math Types Consistency", () => {
  const allTypes = Object.values(TYPES).flat();

  test("should have an INPUTS entry for every type", () => {
    const missing = allTypes.filter((type) => !(type in INPUTS));
    expect(missing).toEqual([]);
  });

  test("should have a COMPUTE entry for every type", () => {
    const missing = allTypes.filter((type) => !(type in COMPUTE));
    expect(missing).toEqual([]);
  });

  test("should not have extra keys in INPUTS", () => {
    const extras = Object.keys(INPUTS).filter(
      (type) => !allTypes.includes(type)
    );
    expect(extras).toEqual([]);
  });

  test("should not have extra keys in COMPUTE", () => {
    const extras = Object.keys(COMPUTE).filter(
      (type) => !allTypes.includes(type)
    );
    expect(extras).toEqual([]);
  });
});
