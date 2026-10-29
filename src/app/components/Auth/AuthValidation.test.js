import { describe, expect, it } from "vitest";

import {
  validateEmail,
  validatePassword,
  validatePasswordsMatch,
  validateRequired,
  validateVerificationCode,
} from "./AuthValidation";
import { normalizeEmailAddress } from "../../utils/registrationAvailability";

describe("Auth validation", () => {
  it("accepts valid email addresses and rejects invalid ones", () => {
    expect(validateEmail("user@example.com")).toBeNull();
    expect(validateEmail(" user@Example.com ")).toBeNull();
    expect(validateEmail("invalid-email")).toBe("Enter a valid email");
    expect(validateEmail("")).toBe("Email is required");
  });

  it("requires valid password values and matching confirmation", () => {
    expect(validatePassword("short")).toBe(
      "Password must be at least 8 characters",
    );
    expect(validatePassword("password123")).toBeNull();
    expect(validatePasswordsMatch("password123", "password123")).toBeNull();
    expect(validatePasswordsMatch("password123", "different")).toBe(
      "Passwords do not match",
    );
    expect(validateRequired("username", "Username")).toBeNull();
    expect(validateRequired("", "Username")).toBe("Username is required");
  });

  it("normalizes email values before backend submission", () => {
    expect(normalizeEmailAddress(" USER@Example.com ")).toBe(
      "user@example.com",
    );
  });

  it("requires a six-digit verification code", () => {
    expect(validateVerificationCode("")).toBe("Verification code is required");
    expect(validateVerificationCode("12ab56")).toBe(
      "Verification code must contain only numbers",
    );
    expect(validateVerificationCode("123")).toBe(
      "Verification code must be exactly 6 digits",
    );
    expect(validateVerificationCode("012345")).toBeNull();
  });
});
