import { afterEach, describe, expect, it, vi } from "vitest";

import getApiBaseUrl, {
  normalizeBaseUrl,
  resolveDevelopmentApiUrl,
} from "./getApiBaseUrl";

describe("normalizeBaseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the local API when no value is configured", () => {
    expect(normalizeBaseUrl()).toBe("http://localhost:8081");
  });

  it("uses localhost directly for localhost development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://127.0.0.1:8081");

    expect(getApiBaseUrl("localhost")).toBe("http://localhost:8081");
  });

  it("uses the browser LAN hostname with a loopback development endpoint", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:8081");

    expect(getApiBaseUrl("192.168.1.109")).toBe(
      "http://192.168.1.109:8081",
    );
    expect(getApiBaseUrl("trackfusion-dev.local")).toBe(
      "http://trackfusion-dev.local:8081",
    );
  });

  it("preserves explicitly configured external development APIs", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.dev.example.com");

    expect(getApiBaseUrl("192.168.1.109")).toBe(
      "https://api.dev.example.com",
    );
  });

  it("uses NEXT_PUBLIC_API_URL in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/");

    expect(getApiBaseUrl("192.168.1.109")).toBe(
      "https://api.example.com",
    );
  });

  it("keeps the configured hostname during server rendering", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:8081");

    expect(getApiBaseUrl("")).toBe("http://localhost:8081");
  });

  it("rejects browser hostnames containing URL components", () => {
    expect(() =>
      resolveDevelopmentApiUrl(
        "http://localhost:8081",
        "192.168.1.109/path",
      ),
    ).toThrow("Browser hostname must not contain URL components");
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
