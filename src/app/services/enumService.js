import { apiClient, toApiError } from "./apiClient";

export async function fetchTrackAttributes() {
  try {
    const response = await apiClient.get("/enums/trackAttributes");
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to fetch track attributes");
  }
}
