import { describe, expect, it } from "vitest";

import { resolveRemoteImageConfig } from "./remoteImages.mjs";

describe("resolveRemoteImageConfig", () => {
  it("preserves the protocol and port of a local storage origin", () => {
    expect(
      resolveRemoteImageConfig({
        NODE_ENV: "development",
        NEXT_IMAGE_REMOTE_ORIGINS: "http://localhost:9000",
      }),
    ).toEqual({
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost",
          port: "9000",
          pathname: "/**",
        },
      ],
      dangerouslyAllowLocalIP: true,
    });
  });

  it("keeps local-IP access disabled in production", () => {
    expect(
      resolveRemoteImageConfig({
        NODE_ENV: "production",
        NEXT_IMAGE_REMOTE_ORIGINS:
          "http://127.0.0.1:9000,https://s3.us-east-1.amazonaws.com",
      }).dangerouslyAllowLocalIP,
    ).toBe(false);
  });

  it("allows an explicitly configured private LAN storage origin in development", () => {
    const config = resolveRemoteImageConfig({
      NODE_ENV: "development",
      NEXT_IMAGE_REMOTE_ORIGINS: "http://192.168.1.109:9000",
    });

    expect(config.remotePatterns).toEqual([
      {
        protocol: "http",
        hostname: "192.168.1.109",
        port: "9000",
        pathname: "/**",
      },
    ]);
    expect(config.dangerouslyAllowLocalIP).toBe(true);
  });

  it("does not enable private-IP access for a public development origin", () => {
    expect(
      resolveRemoteImageConfig({
        NODE_ENV: "development",
        NEXT_IMAGE_REMOTE_ORIGINS: "https://media.example.com",
      }).dangerouslyAllowLocalIP,
    ).toBe(false);
  });

  it("supports and deduplicates the legacy hostname variable", () => {
    const config = resolveRemoteImageConfig({
      NODE_ENV: "production",
      NEXT_IMAGE_REMOTE_ORIGINS: "https://s3.us-east-1.amazonaws.com",
      NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS:
        "s3.us-east-1.amazonaws.com, https://media.example.com",
    });

    expect(config.remotePatterns).toHaveLength(2);
    expect(config.remotePatterns[1]).toMatchObject({
      protocol: "https",
      hostname: "media.example.com",
      port: "",
    });
  });

  it("rejects entries that are not exact origins", () => {
    expect(() =>
      resolveRemoteImageConfig({
        NODE_ENV: "development",
        NEXT_IMAGE_REMOTE_ORIGINS: "http://127.0.0.1:9000/a-bucket",
      }),
    ).toThrow("must be exact HTTP(S) origins");
  });
});
