"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { isPresignedArtworkUrl } from "./trackArtworkUtils";

export const DEFAULT_TRACK_ARTWORK = "/images/6068474.jpg";

export default function TrackArtwork({
  src,
  fallbackSrc = DEFAULT_TRACK_ARTWORK,
  alt = "Track cover",
  onError,
  ...imageProps
}) {
  const initialSrc = src || fallbackSrc;
  const [activeSrc, setActiveSrc] = useState(initialSrc);

  useEffect(() => {
    setActiveSrc(src || fallbackSrc);
  }, [fallbackSrc, src]);

  function handleError(event) {
    onError?.(event);
    setActiveSrc((current) => (current === fallbackSrc ? current : fallbackSrc));
  }

  return (
    <Image
      {...imageProps}
      src={activeSrc}
      alt={alt}
      unoptimized={isPresignedArtworkUrl(activeSrc)}
      onError={handleError}
    />
  );
}
