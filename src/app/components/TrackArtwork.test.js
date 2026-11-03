import { describe, expect, it } from "vitest";

import { isPresignedArtworkUrl } from "./trackArtworkUtils";

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
});
