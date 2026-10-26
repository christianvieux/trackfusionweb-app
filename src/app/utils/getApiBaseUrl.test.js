import { describe, expect, it } from "vitest";

import { normalizeBaseUrl } from "./getApiBaseUrl";

describe("normalizeBaseUrl", () => {
  it("uses the local API when no value is configured", () => {
    expect(normalizeBaseUrl()).toBe("http://localhost:3000");
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
