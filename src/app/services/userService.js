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

const REGISTRATION_GRANT_ERROR_CODES = new Set([
  "REGISTRATION_GRANT_REQUIRED",
  "REGISTRATION_GRANT_INVALID",
]);

function createRegistrationGrantError(code, message, cause) {
  const error = new Error(message, cause ? { cause } : undefined);
  error.code = code;
  return error;
}

export function isRegistrationGrantError(error) {
  return REGISTRATION_GRANT_ERROR_CODES.has(error?.code);
}

export async function register(email, username, password, registrationGrant) {
  const normalizedRegistrationGrant =
    typeof registrationGrant === "string" ? registrationGrant.trim() : "";

  if (!normalizedRegistrationGrant) {
    throw createRegistrationGrantError(
      "REGISTRATION_GRANT_REQUIRED",
      "Email verification is required. Request a new code and verify again.",
    );
  }

  try {
    const response = await apiClient.post("/users/register", {
      email,
      username,
      password,
      registration_grant: normalizedRegistrationGrant,
    });
    return response.data;
  } catch (error) {
    const apiError = toApiError(
      error,
      "Failed to complete registration. Please try again.",
    );
    const responseError = error?.response?.data?.error;

    if (
      error?.response?.status === 400 &&
      typeof responseError === "string" &&
      /email verification.*(?:required|invalid|expired)/i.test(responseError)
    ) {
      throw createRegistrationGrantError(
        "REGISTRATION_GRANT_INVALID",
        apiError.message,
        error,
      );
    }

    throw apiError;
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

export async function updateAvatar(avatar) {
  try {
    const response = await apiClient.put("/users/avatar", avatar);
    return response.data.avatar;
  } catch (error) {
    throw toApiError(error, "Failed to save your avatar. Please try again.");
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
