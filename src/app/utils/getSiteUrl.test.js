import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteUrl, normalizeSiteUrl } from "./getSiteUrl";

describe("site URL utilities", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("normalizes configured site origins", () => {
    expect(normalizeSiteUrl("https://trackfusionweb.com/")).toBe(
      "https://trackfusionweb.com",
    );
  });

  it("uses Next.js's default local port as its development fallback", () => {
    expect(normalizeSiteUrl("")).toBe("http://localhost:3000");
  });

  it("uses NEXT_PUBLIC_SITE_URL when it is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://music.example.com/");

    expect(getSiteUrl("/track/42")).toBe(
      "https://music.example.com/track/42",
    );
  });

  it("creates absolute URLs from route paths", () => {
    expect(getSiteUrl("/track/42")).toMatch(/\/track\/42$/);
    expect(getSiteUrl("profile/7")).toMatch(/\/profile\/7$/);
  });
});
