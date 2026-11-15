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
const MAX_CONSECUTIVE_STATUS_ERRORS = 3;

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

export async function fetchRecentTrackPage(page, limit) {
  try {
    const response = await apiClient.get("/tracks/public", {
      params: { paginated: true, page, limit },
    });
    return response.data;
  } catch (error) {
    throw toApiError(
      error,
      "Failed to fetch recent tracks. Please try again.",
    );
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
  let consecutiveErrors = 0;

  for (let attempt = 0; attempt < MAX_UPLOAD_STATUS_CHECKS; attempt += 1) {
    let status;
    try {
      ({ data: status } = await apiClient.get(
        `/upload/track-status/${encodedJobId}`,
      ));
      consecutiveErrors = 0;
    } catch (error) {
      consecutiveErrors += 1;
      if (
        error?.response?.status === 401 ||
        error?.response?.status === 404 ||
        consecutiveErrors >= MAX_CONSECUTIVE_STATUS_ERRORS
      ) {
        throw new Error(
          "We lost contact while processing this track. Check My Tracks before retrying.",
        );
      }
      await delay(UPLOAD_STATUS_INTERVAL_MS);
      continue;
    }

    if (status.state === "completed") return status.result;

    if (status.state === "failed") {
      const uploadError = new Error(
        status.error || "We couldn't process this track. Please try again.",
      );
      uploadError.code = status.code;
      uploadError.referenceId = status.referenceId;
      uploadError.reportable = status.code === "PROCESSING_FAILED";
      throw uploadError;
    }

    onProgressChange?.(
      uploadStates.PROCESSING,
      getProcessingProgress(status.state, status.progress),
    );

    await delay(UPLOAD_STATUS_INTERVAL_MS);
  }

  throw new Error("Upload processing timed out");
}

export function getProcessingProgress(state, workerProgress) {
  if (state === "waiting" || state === "delayed") return 72;
  const progress = String(workerProgress || "").toLowerCase();
  if (progress.includes("download")) return 76;
  if (progress.includes("validat")) return 80;
  if (progress.includes("analyz")) return 84;
  if (progress.includes("metadata")) return 88;
  if (progress.includes("database") || progress.includes("saving")) return 92;
  if (progress.includes("final")) return 96;
  if (progress.includes("complete")) return 99;
  return 74;
}

async function createPresignedUpload(file, type) {
  if (!file) return undefined;

  const { data } = await apiClient.post("/aws/presigned-url", {
    fileName: file.name,
    contentType: file.type,
    type,
    size: file.size,
  });

  return data;
}

export async function fetchUploadConstraints() {
  try {
    const { data } = await apiClient.get("/upload/constraints");
    return data;
  } catch (error) {
    throw toApiError(error, "Failed to load upload requirements. Please try again.");
  }
}

export function getQueuedUploadReference(upload) {
  const key = upload?.key?.trim();
  if (!key) throw new Error("The upload service did not return a storage key.");
  return { key };
}

export async function uploadTrack(formData, onProgressChange) {
  try {
    onProgressChange?.(uploadStates.PREPARING, 10);

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

    onProgressChange?.(uploadStates.UPLOADING, 15);
    let trackProgress = 0;
    let imageProgress = imageFile instanceof File ? 0 : 100;
    const reportTransferProgress = () => {
      const weightedProgress = imageFile instanceof File
        ? trackProgress * 0.85 + imageProgress * 0.15
        : trackProgress;
      onProgressChange?.(
        uploadStates.UPLOADING,
        Math.round(15 + weightedProgress * 0.55),
      );
    };
    await Promise.all([
      awsUploadService.uploadToS3(trackUrl.uploadUrl, trackFile, (progress) => {
        trackProgress = progress;
        reportTransferProgress();
      }),
      imageFile instanceof File
        ? awsUploadService.uploadToS3(imageUrl.uploadUrl, imageFile, (progress) => {
            imageProgress = progress;
            reportTransferProgress();
          })
        : undefined,
    ]);

    onProgressChange?.(uploadStates.PROCESSING, 72);
    const { data } = await apiClient.post("/upload/track", {
      trackUrl: getQueuedUploadReference(trackUrl),
      imageUrl: imageUrl ? getQueuedUploadReference(imageUrl) : undefined,
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
    onProgressChange?.(uploadStates.COMPLETED, 100);

    return track;
  } catch (error) {
    if (
      error?.response?.status === 403 &&
      String(error?.config?.method || "").toLowerCase() === "put"
    ) {
      throw new Error("The upload link expired. Select the files and try again.");
    }
    if (error?.referenceId || error?.code === "PROCESSING_FAILED") throw error;
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
