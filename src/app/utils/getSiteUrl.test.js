import { describe, expect, it } from "vitest";

import { getSiteUrl, normalizeSiteUrl } from "./getSiteUrl";

describe("site URL utilities", () => {
  it("normalizes configured site origins", () => {
    expect(normalizeSiteUrl("https://trackfusionweb.com/")).toBe(
      "https://trackfusionweb.com",
    );
  });

  it("creates absolute URLs from route paths", () => {
    expect(getSiteUrl("/track/42")).toMatch(/\/track\/42$/);
    expect(getSiteUrl("profile/7")).toMatch(/\/profile\/7$/);
  });
});
