import { apiClient, toApiError } from "./apiClient";

export async function fetchEnumValues(type) {
  try {
    const response = await apiClient.get(
      `/enums/${encodeURIComponent(String(type))}`,
    );
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to fetch enum values");
  }
}

export async function fetchTrackAttributes() {
  try {
    const response = await apiClient.get("/enums/trackAttributes");
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to fetch track attributes");
  }
}
