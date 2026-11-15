import { describe, expect, it } from "vitest";

import { resolveAllowedDevOrigins } from "./browserOrigins.mjs";

const networkInterfaces = {
  eth0: [
    { address: "127.0.0.1", family: "IPv4", internal: true },
    { address: "192.168.1.50", family: "IPv4", internal: false },
    { address: "fe80::1234", family: "IPv6", internal: false },
  ],
  wifi: [{ address: "192.168.1.50", family: "IPv4", internal: false }],
};

describe("resolveAllowedDevOrigins", () => {
  it("supports localhost without configuration", () => {
    expect(resolveAllowedDevOrigins({}, {})).toEqual(["localhost"]);
  });

  it("derives and deduplicates hostnames from exact origins", () => {
    expect(
      resolveAllowedDevOrigins(
        {
          ALLOWED_BROWSER_ORIGINS:
            "http://localhost:3000, http://192.168.1.50:3001, https://192.168.1.50:3443",
        },
        {},
      ),
    ).toEqual(["localhost", "192.168.1.50"]);
  });

  it("rejects entries that are not exact HTTP(S) origins", () => {
    expect(() =>
      resolveAllowedDevOrigins(
        {
          ALLOWED_BROWSER_ORIGINS: "http://192.168.1.50:3001/dashboard",
        },
        {},
      ),
    ).toThrow(
      "ALLOWED_BROWSER_ORIGINS must contain exact HTTP(S) origins without paths",
    );
  });

  it("adds only addresses assigned to non-loopback interfaces", () => {
    expect(
      resolveAllowedDevOrigins({ NODE_ENV: "development" }, networkInterfaces),
    ).toEqual(["localhost", "192.168.1.50", "[fe80::1234]"]);
  });

  it("does not inspect network interfaces in production", () => {
    expect(
      resolveAllowedDevOrigins(
        { NODE_ENV: "production" },
        new Proxy(
          {},
          {
            ownKeys() {
              throw new Error("production must not inspect network interfaces");
            },
          },
        ),
      ),
    ).toEqual([]);
  });
});
