const DEFAULT_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
  "audio/x-m4a",
  "audio/aac",
];

const DEFAULT_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export function parseAllowedTypes(value, defaults) {
  const parsedTypes = String(value || "")
    .split(",")
    .map((type) => type.trim().toLowerCase())
    .filter(Boolean);

  return parsedTypes.length ? parsedTypes : defaults;
}

export const ALLOWED_AUDIO_TYPES = parseAllowedTypes(
  process.env.NEXT_PUBLIC_ALLOWED_AUDIO_TYPES,
  DEFAULT_AUDIO_TYPES,
);

export const ALLOWED_IMAGE_TYPES = parseAllowedTypes(
  process.env.NEXT_PUBLIC_ALLOWED_IMAGE_TYPES,
  DEFAULT_IMAGE_TYPES,
);
