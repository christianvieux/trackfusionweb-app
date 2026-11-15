import { describe, expect, it } from "vitest";

import { getPasswordRequirements, validatePasswordForm } from "./utils";

describe("account password validation", () => {
  it("matches the backend minimum-length rule without hidden character rules", () => {
    expect(getPasswordRequirements("alllowercase")).toEqual({ minLength: true });
    expect(
      validatePasswordForm({
        currentPassword: "old-password",
        newPassword: "short",
        confirmPassword: "short",
      }),
    ).toEqual({ newPassword: "New password must be at least 8 characters" });
  });
});
