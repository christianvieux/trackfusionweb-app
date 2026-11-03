import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "./apiClient";
import {
  isRegistrationGrantError,
  register,
  updateAvatar,
} from "./userService";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("updateAvatar", () => {
  const avatar = {
    shape: "ghost",
    expression: "neutral",
    color: "#8B5CF6",
    seed: "2f",
  };

  it("returns the saved avatar from the authenticated endpoint", async () => {
    const put = vi.spyOn(apiClient, "put").mockResolvedValue({
      data: { avatar },
    });

    await expect(updateAvatar(avatar)).resolves.toEqual(avatar);
    expect(put).toHaveBeenCalledWith("/users/avatar", avatar);
  });

  it("surfaces a retryable save error", async () => {
    vi.spyOn(apiClient, "put").mockRejectedValue({
      response: { status: 500, data: { error: "Unable to save avatar" } },
    });

    await expect(updateAvatar(avatar)).rejects.toThrow(/failed to save your avatar/i);
  });
});

describe("register", () => {
  it("submits the explicit registration grant without the OTP code", async () => {
    const post = vi.spyOn(apiClient, "post").mockResolvedValue({
      data: { user: { id: 7 } },
    });

    const result = await register(
      "listener@example.com",
      "listener",
      "password123",
      "explicit-registration-grant",
    );

    expect(result).toEqual({ user: { id: 7 } });
    expect(post).toHaveBeenCalledWith("/users/register", {
      email: "listener@example.com",
      username: "listener",
      password: "password123",
      registration_grant: "explicit-registration-grant",
    });
    expect(post.mock.calls[0][1]).not.toHaveProperty("otp_code");
  });

  it("prevents registration when the grant is missing", async () => {
    const post = vi.spyOn(apiClient, "post");

    const registration = register(
      "listener@example.com",
      "listener",
      "password123",
      "",
    );

    await expect(registration).rejects.toMatchObject({
      code: "REGISTRATION_GRANT_REQUIRED",
    });
    expect(post).not.toHaveBeenCalled();
  });

  it("identifies expired or invalid grant responses safely", async () => {
    vi.spyOn(apiClient, "post").mockRejectedValue({
      response: {
        status: 400,
        data: { error: "Email verification is invalid or has expired" },
      },
    });

    const registration = register(
      "listener@example.com",
      "listener",
      "password123",
      "expired-registration-grant",
    );

    await expect(registration).rejects.toSatisfy((error) => {
      expect(isRegistrationGrantError(error)).toBe(true);
      expect(error.message).toMatch(/invalid or has expired/i);
      return true;
    });
  });
});
