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

export function getApiErrorMessage(error, fallbackMessage) {
  const responseMessage = error?.response?.data?.error;

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
    return "The request timed out. Please try again.";
  }

  if (!error?.response && error?.request) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  return fallbackMessage;
}

export function toApiError(error, fallbackMessage) {
  return new Error(getApiErrorMessage(error, fallbackMessage), {
    cause: error,
  });
}
