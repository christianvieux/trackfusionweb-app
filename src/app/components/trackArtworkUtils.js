export function isPresignedArtworkUrl(value) {
  if (typeof value !== "string" || !value.includes("?")) return false;

  try {
    const url = new URL(value);
    return (
      url.searchParams.has("X-Amz-Signature") ||
      url.searchParams.has("x-amz-signature")
    );
  } catch {
    return false;
  }
}

export function isRenderableArtworkSource(value) {
  if (typeof value !== "string") return false;

  const source = value.trim();
  if (!source) return false;

  // A leading slash is a Next.js public asset path. Bare paths such as
  // "covers/36/file.webp" are private storage keys, not browser URLs.
  if (source.startsWith("/") && !source.startsWith("//")) return true;

  try {
    const url = new URL(source);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getTrackArtworkSource(src, fallbackSrc, failedSrc = null) {
  const requestedSrc = isRenderableArtworkSource(src) ? src.trim() : fallbackSrc;
  return requestedSrc === failedSrc ? fallbackSrc : requestedSrc;
}
