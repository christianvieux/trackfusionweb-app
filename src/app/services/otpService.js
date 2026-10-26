import { apiClient, toApiError } from "./apiClient";

const OTP_FALLBACK = "An unexpected error occurred. Please try again.";

export async function generateOtp(email, purpose) {
  try {
    const response = await apiClient.post("/otp/generate", {
      email,
      purpose,
    });
    return response.data;
  } catch (error) {
    throw toApiError(error, OTP_FALLBACK);
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
    throw toApiError(error, OTP_FALLBACK);
  }
}

export async function checkOtpCooldown(email, purpose) {
  try {
    const response = await apiClient.get("/otp/cooldown", {
      params: { email, purpose },
    });
    return response.data;
  } catch (error) {
    throw toApiError(error, OTP_FALLBACK);
  }
}
