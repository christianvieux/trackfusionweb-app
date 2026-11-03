import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "./apiClient";
import { awsUploadService } from "./awsService";
import { analyzeAudio, getAnalysisTrackReference } from "./audioService";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getAnalysisTrackReference", () => {
  it("keeps only the stable storage key from a presign response", () => {
    expect(
      getAnalysisTrackReference({
        key: "uploads/42/example.mp3",
        uploadUrl: "http://127.0.0.1:9000/signed-upload",
        publicUrl: "uploads/42/example.mp3",
      }),
    ).toEqual({ key: "uploads/42/example.mp3" });
  });

  it("rejects an incomplete presign response", () => {
    expect(() => getAnalysisTrackReference({})).toThrow(/storage object key/i);
  });
});

describe("analyzeAudio", () => {
  it("uploads with the signed URL but queues analysis with only the object key", async () => {
    const presignedUpload = {
      key: "uploads/42/example.mp3",
      uploadUrl: "http://127.0.0.1:9000/signed-upload",
      publicUrl: "uploads/42/example.mp3",
    };
    const post = vi
      .spyOn(apiClient, "post")
      .mockResolvedValueOnce({ data: presignedUpload })
      .mockResolvedValueOnce({ data: { jobId: 9 } });
    vi.spyOn(apiClient, "get").mockResolvedValue({
      data: { state: "completed", progress: "completed", result: { bpm: 90 } },
    });
    const upload = vi
      .spyOn(awsUploadService, "uploadToS3")
      .mockResolvedValue(undefined);
    const file = { name: "example.mp3", type: "audio/mpeg" };

    await expect(analyzeAudio(file, "75-150")).resolves.toEqual({ bpm: 90 });

    expect(upload).toHaveBeenCalledWith(
      presignedUpload.uploadUrl,
      file,
      expect.any(Function),
    );
    expect(post).toHaveBeenNthCalledWith(2, "/audio/analyze", {
      trackUrl: { key: presignedUpload.key },
      bpmRange: "75-150",
    });
  });
});
