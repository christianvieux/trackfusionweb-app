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

export function getTrackArtworkSource(src, fallbackSrc, failedSrc = null) {
  const requestedSrc = src || fallbackSrc;
  return requestedSrc === failedSrc ? fallbackSrc : requestedSrc;
}
