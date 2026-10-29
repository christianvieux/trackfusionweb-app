import { apiClient, toApiError } from "./apiClient";

export async function generateOtp(email, purpose) {
  try {
    const response = await apiClient.post("/otp/generate", {
      email,
      purpose,
    });
    return response.data;
  } catch (error) {
    throw toApiError(
      error,
      "Could not send the verification code. Please try again.",
    );
  }
}

export async function verifyOtp(email, otpCode, purpose) {
  try {
    const response = await apiClient.post("/otp/verify", {
      email,
      otp_code: otpCode,
      purpose,
    });
    return response.data;
  } catch (error) {
    throw toApiError(
      error,
      "Could not verify the code. Please check it and try again.",
    );
  }
}

export async function checkOtpCooldown(email, purpose) {
  try {
    const response = await apiClient.get("/otp/cooldown", {
      params: { email, purpose },
    });
    return response.data;
  } catch (error) {
    throw toApiError(
      error,
      "Could not check verification-code availability. Please try again.",
    );
  }
}
