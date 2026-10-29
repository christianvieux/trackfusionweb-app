import { apiClient, toApiError } from "./apiClient";
import { awsUploadService } from "./awsService";

export const ProfileUploadStates = {
  PREPARING: "PREPARING",
  UPLOADING: "UPLOADING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

const PROFILE_STATUS_ATTEMPTS = 60;
const PROFILE_STATUS_INTERVAL_MS = 1_000;

function encodePathSegment(value) {
  return encodeURIComponent(String(value));
}

function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
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

async function checkProfilePictureProcessingStatus(jobId, onProgressChange) {
  const encodedJobId = encodePathSegment(jobId);

  for (let attempt = 0; attempt < PROFILE_STATUS_ATTEMPTS; attempt += 1) {
    const { data: status } = await apiClient.get(
      `/upload/profile-picture-status/${encodedJobId}`,
    );

    if (status.state === "completed") return status.result;

    if (status.state === "failed") {
      throw new Error(
        "We couldn't process this profile picture. Try a different image.",
      );
    }

    if (status.progress) {
      onProgressChange?.(ProfileUploadStates.PROCESSING, status.progress);
    }

    await delay(PROFILE_STATUS_INTERVAL_MS);
  }

  throw new Error("Profile picture processing timed out");
}

export async function updateProfilePicture(file, onProgressChange = () => {}) {
  try {
    onProgressChange(ProfileUploadStates.PREPARING);

    if (!file) throw new Error("No file provided");

    const { data: imageUrl } = await apiClient.post("/aws/presigned-url", {
      fileName: file.name,
      contentType: file.type,
      type: "profile-picture",
    });

    onProgressChange(ProfileUploadStates.UPLOADING);
    await awsUploadService.uploadToS3(imageUrl.uploadUrl, file);

    onProgressChange(ProfileUploadStates.PROCESSING);
    const { data } = await apiClient.post("/upload/profile-picture", {
      imageUrl,
    });

    const result = await checkProfilePictureProcessingStatus(
      data.jobId,
      onProgressChange,
    );
    onProgressChange(ProfileUploadStates.COMPLETED);

    return result;
  } catch (error) {
    onProgressChange(ProfileUploadStates.FAILED);
    throw toApiError(
      error,
      "Failed to upload profile picture. Please try again.",
    );
  }
}
