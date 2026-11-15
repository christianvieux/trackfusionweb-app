import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteUrl, normalizeSiteUrl } from "./getSiteUrl";

describe("site URL utilities", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("normalizes configured site origins", () => {
    expect(normalizeSiteUrl("https://www.trackfusionweb.com/")).toBe(
      "https://www.trackfusionweb.com",
    );
  });

  it("uses the canonical production origin as its production fallback", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(normalizeSiteUrl("")).toBe("https://www.trackfusionweb.com");
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

  it("uses the current browser origin for device-independent development links", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");

    expect(getSiteUrl("/track/42", "http://192.168.1.50:3000")).toBe(
      "http://192.168.1.50:3000/track/42",
    );
  });

  it("keeps the configured canonical origin in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.trackfusionweb.com");

    expect(getSiteUrl("/track/42", "http://192.168.1.50:3000")).toBe(
      "https://www.trackfusionweb.com/track/42",
    );
  });

  it("creates absolute URLs from route paths", () => {
    expect(getSiteUrl("/track/42")).toMatch(/\/track\/42$/);
    expect(getSiteUrl("profile/7")).toMatch(/\/profile\/7$/);
  });
});
