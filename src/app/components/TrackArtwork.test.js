import { describe, expect, it } from "vitest";

import {
  getTrackArtworkSource,
  isPresignedArtworkUrl,
} from "./trackArtworkUtils";

describe("track artwork", () => {
  it("identifies AWS and S3-compatible presigned artwork URLs", () => {
    expect(
      isPresignedArtworkUrl(
        "https://private.example/covers/1/a.jpg?X-Amz-Expires=3600&X-Amz-Signature=abc",
      ),
    ).toBe(true);
  });

  it("keeps local fallback and ordinary public images optimized", () => {
    expect(isPresignedArtworkUrl("/images/6068474.jpg")).toBe(false);
    expect(isPresignedArtworkUrl("https://images.example/cover.jpg")).toBe(false);
  });

  it("uses a changed artwork URL immediately after the previous URL failed", () => {
    const fallback = "/images/6068474.jpg";
    const failed = "https://images.example/old-cover.jpg";

    expect(getTrackArtworkSource(failed, fallback, failed)).toBe(fallback);
    expect(
      getTrackArtworkSource(
        "https://images.example/new-cover.jpg",
        fallback,
        failed,
      ),
    ).toBe("https://images.example/new-cover.jpg");
  });
});
