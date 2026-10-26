import { apiClient, toApiError } from "./apiClient";

function encodePathSegment(value) {
  return encodeURIComponent(String(value));
}

export async function deleteOwnedTrack(trackId) {
  try {
    const response = await apiClient.delete(
      `/tracks/${encodePathSegment(trackId)}`,
    );
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to delete the track. Please try again.");
  }
}

export async function removeFavoriteTrack(trackId) {
  try {
    await apiClient.delete("/tracks/favorites", { data: { trackId } });
    return true;
  } catch (error) {
    throw toApiError(
      error,
      "Failed to remove the track from favorites. Please try again.",
    );
  }
}

export async function addFavoriteTrack(trackId) {
  try {
    await apiClient.post("/tracks/favorites", { trackId });
    return true;
  } catch (error) {
    throw toApiError(
      error,
      "Failed to add the track to favorites. Please try again.",
    );
  }
}

export async function fetchFavoriteTracks() {
  try {
    const response = await apiClient.get("/tracks/favorites");
    return response.data;
  } catch (error) {
    throw toApiError(
      error,
      "Failed to load favorite tracks. Please try again.",
    );
  }
}

export async function fetchOwnedTracks() {
  try {
    const response = await apiClient.get("/tracks/user");
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to load your tracks. Please try again.");
  }
}

export async function register(email, username, password, otpCode) {
  try {
    const response = await apiClient.post("/users/register", {
      email,
      username,
      password,
      otp_code: otpCode,
    });
    return response.data;
  } catch (error) {
    throw toApiError(
      error,
      "Failed to complete registration. Please try again.",
    );
  }
}

export async function checkEmail(email) {
  try {
    const response = await apiClient.post("/users/check-email", { email });
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to check email. Please try again.");
  }
}

export async function fetchPublicUserInfo(userId) {
  try {
    const response = await apiClient.get(
      `/users/info/${encodePathSegment(userId)}`,
    );
    return response.data;
  } catch (error) {
    throw toApiError(
      error,
      "Failed to get user information. Please try again.",
    );
  }
}

export async function fetchUserPublicFavoriteTracks(userId) {
  try {
    const response = await apiClient.get(
      `/public/favorite-tracks/${encodePathSegment(userId)}`,
    );
    return response.data;
  } catch (error) {
    throw toApiError(
      error,
      "Failed to load this user’s favorite tracks. Please try again.",
    );
  }
}

export async function fetchUserPublicTracks(userId) {
  try {
    const response = await apiClient.get(
      `/public/tracks/${encodePathSegment(userId)}`,
    );
    return response.data;
  } catch (error) {
    throw toApiError(
      error,
      "Failed to load this user’s tracks. Please try again.",
    );
  }
}
