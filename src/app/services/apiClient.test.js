import { describe, expect, it } from "vitest";

import { getApiErrorMessage, getUserFacingErrorMessage } from "./apiClient";

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

  it("translates raw verification-code validation errors", () => {
    const error = {
      response: {
        status: 400,
        data: {
          error:
            '"otp_code" with value "123" fails to match the required pattern: /^\\d{6}$/',
        },
      },
    };

    expect(getApiErrorMessage(error, "Fallback")).toBe(
      "Verification code must be exactly 6 digits.",
    );
  });

  it("translates common validation messages and nested API errors", () => {
    const error = {
      response: {
        status: 400,
        data: { error: { message: '"email" must be a valid email' } },
      },
    };

    expect(getApiErrorMessage(error, "Fallback")).toBe(
      "Enter a valid email address.",
    );
    expect(
      getUserFacingErrorMessage("OTP code not found or invalid", "Fallback"),
    ).toBe("That verification code is incorrect. Please try again.");
  });

  it("does not expose internal or technical error details", () => {
    expect(
      getApiErrorMessage(
        {
          response: {
            status: 500,
            data: { error: "SQLSTATE 42P01: relation users does not exist" },
          },
        },
        "Could not load your account. Please try again.",
      ),
    ).toBe("Could not load your account. Please try again.");

    expect(
      getUserFacingErrorMessage(
        "ValidationError at handler (/srv/app.js:12:4)",
        "Please check your information and try again.",
      ),
    ).toBe("Please check your information and try again.");
  });

  it("provides a clear rate-limit message", () => {
    const error = { response: { status: 429, data: { error: "Limit hit" } } };

    expect(getApiErrorMessage(error, "Fallback")).toBe(
      "Too many requests. Please wait a moment and try again.",
    );
  });
});
