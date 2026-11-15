export const DEFAULT_TRACK_METADATA = {
  category: "",
  genre: [],
  mood: [],
  bpm: "",
};

export const DEFAULT_UPLOAD_CONSTRAINTS = {
  audio: {
    allowedTypes: [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/wave",
      "audio/x-wav",
      "audio/ogg",
      "audio/x-m4a",
      "audio/mp4",
      "audio/aac",
    ],
    maxBytes: 100 * 1024 * 1024,
    maxDurationSeconds: 900,
  },
  image: {
    allowedTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ],
    maxBytes: 8 * 1024 * 1024,
    minWidth: 64,
    minHeight: 64,
    maxDimension: 12000,
    maxPixels: 40000000,
    optional: true,
  },
  metadata: {
    nameMaxLength: 100,
    descriptionMaxLength: 500,
    bpmMin: 0,
    bpmMax: 300,
    required: [],
  },
};

export const UPLOAD_PROGRESS = {
  PREPARING: 25,
  UPLOADING: 50,
  PROCESSING: 75,
  COMPLETED: 100,
};

export const UPLOAD_STATE_MESSAGES = {
  PREPARING: "Preparing files...",
  UPLOADING: "Uploading files...",
  PROCESSING: "Processing track...",
  COMPLETED: "Upload complete!",
};

export function getFileExtensions(types = []) {
  const aliases = {
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/wave": "wav",
    "audio/x-wav": "wav",
    "audio/x-m4a": "m4a",
    "audio/mp4": "m4a",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
  };

  return [
    ...new Set(types.map((type) => aliases[type] || type.split("/")[1])),
  ]
    .map((extension) => `.${extension}`)
    .join(", ");
}

export function getFileInputName(type) {
  return type === "track" ? "trackFile" : "imageFile";
}

export function removeFileExtension(fileName = "") {
  return fileName.replace(/\.[^/.]+$/, "");
}

export function formatLabel(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function validateTrackName(name = "") {
  const MAX_LENGTH = 100;
  const sanitized = name.trim();

  if (!sanitized) {
    return {
      isValid: false,
      error: "Track title is required.",
    };
  }

  if (sanitized.length > MAX_LENGTH) {
    return {
      isValid: false,
      error: `Track title cannot exceed ${MAX_LENGTH} characters.`,
    };
  }

  return {
    isValid: true,
    sanitized,
  };
}

function normalizeAudioType(type = "") {
  const subtype = type.toLowerCase().replace(/^audio\//, "");
  return {
    mpeg: "mp3",
    mp3: "mp3",
    wav: "wav",
    wave: "wav",
    "x-wav": "wav",
    mp4: "m4a",
    "x-m4a": "m4a",
    aac: "aac",
    ogg: "ogg",
  }[subtype] || subtype;
}

export function isAllowedFileType(file, allowedTypes = []) {
  const fileType = String(file?.type || "").toLowerCase();
  const extension = String(file?.name || "")
    .toLowerCase()
    .split(".")
    .pop();

  if (allowedTypes.some((type) => type.startsWith("audio/"))) {
    const allowed = allowedTypes.map(normalizeAudioType);
    return allowed.includes(normalizeAudioType(fileType || extension));
  }

  const normalizedType = fileType.replace("image/jpg", "image/jpeg");
  const allowed = allowedTypes.map((type) =>
    type.replace("image/jpg", "image/jpeg"),
  );
  if (normalizedType) return allowed.includes(normalizedType);
  return allowed.some((type) => type.endsWith(`/${extension}`));
}

export function formatFileSize(bytes) {
  return `${Math.round(bytes / (1024 * 1024))} MiB`;
}

export function validateUploadFile(file, rules, label) {
  if (!file) return `${label} is required.`;
  if (!file.size) return `${label} is empty.`;
  if (!isAllowedFileType(file, rules.allowedTypes)) {
    return `${label} format is unsupported. Choose ${getFileExtensions(rules.allowedTypes)}.`;
  }
  if (file.size > rules.maxBytes) {
    return `${label} exceeds the ${formatFileSize(rules.maxBytes)} limit.`;
  }
  return null;
}

export function validateUploadValues(values, constraints = DEFAULT_UPLOAD_CONSTRAINTS) {
  const errors = {};
  const titleValidation = validateTrackName(values.trackName);

  if (!titleValidation.isValid) errors.trackName = titleValidation.error;
  if (values.trackDescription.length > constraints.metadata.descriptionMaxLength) {
    errors.trackDescription = `Description cannot exceed ${constraints.metadata.descriptionMaxLength} characters.`;
  }

  errors.trackFile = validateUploadFile(
    values.trackFile,
    constraints.audio,
    "Audio file",
  );
  if (values.imageFile) {
    errors.imageFile = validateUploadFile(
      values.imageFile,
      constraints.image,
      "Cover image",
    );
  }

  for (const field of constraints.metadata.required) {
    const value = values.trackMetadata[field];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      errors[field] = `Track ${field} is required.`;
    }
  }

  if (values.trackMetadata.bpm !== "") {
    const bpm = Number(values.trackMetadata.bpm);
    if (
      !Number.isInteger(bpm) ||
      bpm < constraints.metadata.bpmMin ||
      bpm > constraints.metadata.bpmMax
    ) {
      errors.bpm = `BPM must be a whole number between ${constraints.metadata.bpmMin} and ${constraints.metadata.bpmMax}.`;
    }
  }

  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => Boolean(message)),
  );
}
