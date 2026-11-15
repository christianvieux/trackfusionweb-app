import { describe, expect, it } from "vitest";

import {
  DEFAULT_UPLOAD_CONSTRAINTS,
  getFileExtensions,
  isAllowedFileType,
  validateTrackName,
  validateUploadValues,
} from "./utils";

describe("upload validation", () => {
  it("allows backend-supported Unicode and punctuation in titles", () => {
    expect(validateTrackName("R&B — été (live) 🎵")).toEqual({
      isValid: true,
      sanitized: "R&B — été (live) 🎵",
    });
    expect(validateTrackName("x".repeat(101)).error).toBe(
      "Track title cannot exceed 100 characters.",
    );
  });

  it("accepts common browser MIME aliases and reports useful extensions", () => {
    expect(
      isAllowedFileType(
        { name: "demo.m4a", type: "audio/mp4" },
        DEFAULT_UPLOAD_CONSTRAINTS.audio.allowedTypes,
      ),
    ).toBe(true);
    expect(getFileExtensions(["audio/mpeg", "audio/mp3", "audio/x-m4a"]))
      .toBe(".mp3, .m4a");
  });

  it("allows optional metadata while still validating BPM", () => {
    const errors = validateUploadValues({
      trackFile: { name: "demo.mp3", type: "audio/mpeg", size: 100 },
      imageFile: null,
      trackName: "Demo",
      trackDescription: "",
      trackMetadata: { category: "", genre: [], mood: [], bpm: "301" },
    });

    expect(errors).toEqual({
      bpm: "BPM must be a whole number between 0 and 300.",
    });
  });

  it("uses the safe backend fallback limits", () => {
    expect(DEFAULT_UPLOAD_CONSTRAINTS.audio.maxBytes).toBe(100 * 1024 * 1024);
    expect(DEFAULT_UPLOAD_CONSTRAINTS.image).toMatchObject({
      maxBytes: 8 * 1024 * 1024,
      minWidth: 64,
      maxPixels: 40000000,
      optional: true,
    });
    expect(DEFAULT_UPLOAD_CONSTRAINTS.metadata.required).toEqual([]);
  });
});
