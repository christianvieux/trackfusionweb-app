import { describe, expect, it, vi } from "vitest";

import {
  replaceArtworkPreviewUrl,
  revokeArtworkPreviewUrl,
} from "./artworkPreview";

function createUrlApi() {
  return {
    createObjectURL: vi.fn(() => "blob:next-preview"),
    revokeObjectURL: vi.fn(),
  };
}

describe("artwork preview object URLs", () => {
  it("creates a local preview without uploading the file", () => {
    const file = { name: "cover.webp" };
    const urlApi = createUrlApi();

    expect(replaceArtworkPreviewUrl(null, file, urlApi)).toBe(
      "blob:next-preview",
    );
    expect(urlApi.createObjectURL).toHaveBeenCalledWith(file);
  });

  it("revokes the previous preview when artwork is replaced or removed", () => {
    const urlApi = createUrlApi();

    replaceArtworkPreviewUrl("blob:old-preview", { name: "new.png" }, urlApi);
    expect(urlApi.revokeObjectURL).toHaveBeenCalledWith("blob:old-preview");

    expect(replaceArtworkPreviewUrl("blob:next-preview", null, urlApi)).toBeNull();
    expect(urlApi.revokeObjectURL).toHaveBeenCalledWith("blob:next-preview");
  });

  it("revokes the active preview during cleanup", () => {
    const urlApi = createUrlApi();

    revokeArtworkPreviewUrl("blob:active-preview", urlApi);
    expect(urlApi.revokeObjectURL).toHaveBeenCalledWith("blob:active-preview");
  });
});
