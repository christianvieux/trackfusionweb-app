import { apiClient, toApiError } from "./apiClient";
import { awsUploadService } from "./awsService";

const ANALYSIS_STATUS_ATTEMPTS = 300;
const ANALYSIS_STATUS_INTERVAL_MS = 1_000;

const ANALYSIS_PROGRESS = {
  downloading: 33,
  validating_audio: 50,
  analyzing_bpm: 66,
  analyzing_key: 80,
  completed: 100,
};

function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function analyzeAudio(
  file,
  bpmRange,
  onUploadProgress = () => {},
  onAnalysisProgress = () => {},
) {
  try {
    const { data: trackUrl } = await apiClient.post("/aws/presigned-url", {
      fileName: file.name,
      contentType: file.type,
      type: "track",
    });

    await awsUploadService.uploadToS3(
      trackUrl.uploadUrl,
      file,
      onUploadProgress,
    );
    onUploadProgress(0);

    const { data } = await apiClient.post("/audio/analyze", {
      trackUrl,
      bpmRange,
    });
    const encodedJobId = encodeURIComponent(String(data.jobId));

    for (let attempt = 0; attempt < ANALYSIS_STATUS_ATTEMPTS; attempt += 1) {
      const { data: status } = await apiClient.get(
        `/audio/analysis-status/${encodedJobId}`,
      );

      onAnalysisProgress(ANALYSIS_PROGRESS[status.progress] || 0);

      if (status.state === "completed") return status.result;

      if (status.state === "failed") {
        throw new Error(status.error || "Analysis failed");
      }

      await delay(ANALYSIS_STATUS_INTERVAL_MS);
    }

    throw new Error("Audio analysis timed out");
  } catch (error) {
    throw toApiError(error, error.message || "Failed to analyze audio");
  }
}
