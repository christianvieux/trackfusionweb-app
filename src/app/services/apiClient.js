import axios from "axios";

import getApiBaseUrl from "../utils/getApiBaseUrl";

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 20_000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

const USER_MESSAGE_REWRITES = [
  {
    pattern: /(?:otp_code|verification code).*(?:pattern|6|length)/i,
    message: "Verification code must be exactly 6 digits.",
  },
  {
    pattern: /(?:otp code not found or invalid|invalid otp)/i,
    message: "That verification code is incorrect. Please try again.",
  },
  {
    pattern: /(?:verification )?code has expired/i,
    message:
      "That verification code has expired. Request a new code and try again.",
  },
  {
    pattern: /["']?email["']?.*(?:valid email|email address)/i,
    message: "Enter a valid email address.",
  },
  {
    pattern: /["']?(?:password|newPassword)["']?.*(?:at least|length must be)/i,
    message: "Password must be at least 8 characters.",
  },
];

const TECHNICAL_ERROR_PATTERNS = [
  /fails to match the required pattern/i,
  /^["'][^"']+["']\s+(?:is required|must be|is not allowed|contains an invalid value|length must be|with value)/i,
  /\b(?:joi|validationerror|sqlstate)\b/i,
  /\b(?:select|insert into|update|delete from)\b.+\b(?:from|values|set|where)\b/i,
  /\bECONN(?:REFUSED|RESET|ABORTED)\b/i,
  /\bat\s+\S+\s+\(.+:\d+:\d+\)/,
  /\/\^.*\$\//,
  /<\/?[a-z][\s\S]*>/i,
];

function getResponseErrorMessage(error) {
  const responseError = error?.response?.data?.error;

  if (typeof responseError === "string") return responseError;
  if (typeof responseError?.message === "string") return responseError.message;

  return "";
}

export function getUserFacingErrorMessage(message, fallbackMessage) {
  const safeFallback = fallbackMessage?.trim() || DEFAULT_ERROR_MESSAGE;
  const normalizedMessage = typeof message === "string" ? message.trim() : "";

  if (!normalizedMessage) return safeFallback;

  const rewrite = USER_MESSAGE_REWRITES.find(({ pattern }) =>
    pattern.test(normalizedMessage),
  );
  if (rewrite) return rewrite.message;

  if (
    normalizedMessage.length > 240 ||
    /^(?:internal server error|server error)$/i.test(normalizedMessage) ||
    TECHNICAL_ERROR_PATTERNS.some((pattern) => pattern.test(normalizedMessage))
  ) {
    return safeFallback;
  }

  return normalizedMessage;
}

export function getApiErrorMessage(error, fallbackMessage) {
  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
    return "The request timed out. Please try again.";
  }

  if (!error?.response && error?.request) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  if (error?.response?.status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (error?.response?.status >= 500) {
    return fallbackMessage?.trim() || DEFAULT_ERROR_MESSAGE;
  }

  if (!error?.response && !error?.request) {
    return getUserFacingErrorMessage(error?.message, fallbackMessage);
  }

  return getUserFacingErrorMessage(
    getResponseErrorMessage(error),
    fallbackMessage,
  );
}

export function toApiError(error, fallbackMessage) {
  return new Error(getApiErrorMessage(error, fallbackMessage), {
    cause: error,
  });
}
