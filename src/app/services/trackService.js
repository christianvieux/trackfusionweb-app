import { apiClient, toApiError } from "./apiClient";
import { awsUploadService } from "./awsService";

export const uploadStates = {
  PREPARING: "PREPARING",
  UPLOADING: "UPLOADING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
};

const MAX_UPLOAD_STATUS_CHECKS = 60;
const UPLOAD_STATUS_INTERVAL_MS = 5_000;

function encodePathSegment(value) {
  return encodeURIComponent(String(value));
}

function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function fetchRecentTracks() {
  try {
    const response = await apiClient.get("/tracks/public");
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to fetch recent tracks. Please try again.");
  }
}

export async function updateTrack(trackId, updatedData) {
  try {
    const response = await apiClient.put(
      `/tracks/${encodePathSegment(trackId)}`,
      updatedData,
    );
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to update track. Please try again.");
  }
}

async function pollUploadStatus(jobId, onProgressChange) {
  const encodedJobId = encodePathSegment(jobId);

  for (let attempt = 0; attempt < MAX_UPLOAD_STATUS_CHECKS; attempt += 1) {
    const { data: status } = await apiClient.get(
      `/upload/track-status/${encodedJobId}`,
    );

    if (status.state === "completed") return status.result;

    if (status.state === "failed") {
      throw new Error(
        "We couldn't process this track. Check the files and try again.",
      );
    }

    if (status.state === "active") {
      onProgressChange?.(uploadStates.PROCESSING, status.progress);
    }

    await delay(UPLOAD_STATUS_INTERVAL_MS);
  }

  throw new Error("Upload processing timed out");
}

async function createPresignedUpload(file, type) {
  if (!file) return undefined;

  const { data } = await apiClient.post("/aws/presigned-url", {
    fileName: file.name,
    contentType: file.type,
    type,
  });

  return data;
}

export async function uploadTrack(formData, onProgressChange) {
  try {
    onProgressChange?.(uploadStates.PREPARING);

    const trackFile = formData.get("trackFile");
    const imageFile = formData.get("imageFile");

    if (!(trackFile instanceof File)) {
      throw new Error("Choose an audio file before uploading");
    }

    const [trackUrl, imageUrl] = await Promise.all([
      createPresignedUpload(trackFile, "track"),
      imageFile instanceof File
        ? createPresignedUpload(imageFile, "image")
        : undefined,
    ]);

    onProgressChange?.(uploadStates.UPLOADING);
    await Promise.all([
      awsUploadService.uploadToS3(trackUrl.uploadUrl, trackFile),
      imageFile instanceof File
        ? awsUploadService.uploadToS3(imageUrl.uploadUrl, imageFile)
        : undefined,
    ]);

    onProgressChange?.(uploadStates.PROCESSING);
    const { data } = await apiClient.post("/upload/track", {
      trackUrl,
      imageUrl,
      name: formData.get("name"),
      artist: formData.get("artist"),
      description: formData.get("description"),
      genre: formData.get("genre"),
      mood: formData.get("mood"),
      bpm: formData.get("bpm") || null,
      is_private: formData.get("is_private") === "true",
      category: formData.get("category"),
    });

    const track = await pollUploadStatus(data.jobId, onProgressChange);
    onProgressChange?.(uploadStates.COMPLETED);

    return track;
  } catch (error) {
    throw toApiError(error, "Failed to upload track. Please try again.");
  }
}

export async function fetchAuthorizedUrl(trackId) {
  try {
    const response = await apiClient.get(
      `/tracks/${encodePathSegment(trackId)}/authorized-url`,
    );
    return response.data;
  } catch (error) {
    throw toApiError(
      error,
      "Failed to prepare this track for playback. Please try again.",
    );
  }
}

export async function fetchTrack(trackId) {
  try {
    const response = await apiClient.get(
      `/tracks/${encodePathSegment(trackId)}`,
    );
    return response.data;
  } catch (error) {
    throw toApiError(error, "Failed to fetch track. Please try again.");
  }
}
