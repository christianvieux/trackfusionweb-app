import { apiClient, toApiError } from "./apiClient";

function encodePathSegment(value) {
  return encodeURIComponent(String(value));
}

export async function loginUser(email, password) {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw toApiError(error, "An unexpected error occurred. Please try again.");
  }
}

export async function logoutUser() {
  try {
    await apiClient.post("/auth/logout");
    return true;
  } catch (error) {
    throw toApiError(error, "Failed to log out. Please try again.");
  }
}

export async function getSessionStatus() {
  try {
    const response = await apiClient.get("/auth/session");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) return { user: null };

    throw toApiError(error, "Failed to check session. Please try again.");
  }
}

export async function forgotPassword(email) {
  try {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to reset password. Please try again.");
  }
}

export async function resetPassword(token, password) {
  try {
    const response = await apiClient.post(
      `/auth/reset-password/${encodePathSegment(token)}`,
      { password },
    );
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to reset password. Please try again.");
  }
}

export async function verifyResetToken(token) {
  try {
    const response = await apiClient.get(
      `/auth/verify-reset-token/${encodePathSegment(token)}`,
    );
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to verify the reset link.");
  }
}

export async function updatePassword(currentPassword, newPassword) {
  try {
    const response = await apiClient.put("/auth/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to update password. Please try again.");
  }
}
