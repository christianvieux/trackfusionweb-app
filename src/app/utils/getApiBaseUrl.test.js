import { afterEach, describe, expect, it, vi } from "vitest";

import getApiBaseUrl, { normalizeBaseUrl } from "./getApiBaseUrl";

describe("normalizeBaseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the local API when no value is configured", () => {
    expect(normalizeBaseUrl()).toBe("http://localhost:8081");
  });

  it("uses NEXT_PUBLIC_API_URL when it is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/");

    expect(getApiBaseUrl()).toBe("https://api.example.com");
  });

  it("normalizes a configured API origin", () => {
    expect(normalizeBaseUrl(" https://api.example.com/ ")).toBe(
      "https://api.example.com",
    );
  });

  it("rejects relative, non-HTTP, and path-prefixed URLs", () => {
    expect(() => normalizeBaseUrl("/api")).toThrow(/absolute HTTP/);
    expect(() => normalizeBaseUrl("ftp://example.com")).toThrow(
      /absolute HTTP/,
    );
    expect(() => normalizeBaseUrl("https://api.example.com/api")).toThrow(
      /absolute HTTP/,
    );
  });
});
