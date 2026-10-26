import { describe, expect, it } from "vitest";

import { getApiErrorMessage } from "./apiClient";

describe("getApiErrorMessage", () => {
  it("prefers a safe API error response", () => {
    const error = { response: { data: { error: "Track not found" } } };
    expect(getApiErrorMessage(error, "Fallback")).toBe("Track not found");
  });

  it("returns actionable timeout and network messages", () => {
    expect(getApiErrorMessage({ code: "ETIMEDOUT" }, "Fallback")).toMatch(
      /timed out/i,
    );
    expect(getApiErrorMessage({ request: {} }, "Fallback")).toMatch(
      /reach the server/i,
    );
  });
});
