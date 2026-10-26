import { describe, expect, it } from "vitest";

import { parseAllowedTypes } from "./fileTypes";

describe("parseAllowedTypes", () => {
  const defaults = ["audio/mpeg"];

  it("normalizes a comma-separated configuration", () => {
    expect(parseAllowedTypes(" audio/WAV, audio/mpeg ", defaults)).toEqual([
      "audio/wav",
      "audio/mpeg",
    ]);
  });

  it("returns defaults for an empty configuration", () => {
    expect(parseAllowedTypes("", defaults)).toBe(defaults);
  });
});
