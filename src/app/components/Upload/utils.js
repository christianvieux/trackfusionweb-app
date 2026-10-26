export const DEFAULT_TRACK_METADATA = {
  category: "",
  genre: [],
  mood: [],
  bpm: "",
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
  return types.map((type) => `.${type.split("/")[1]}`).join(", ");
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
  const MIN_LENGTH = 3;
  const MAX_LENGTH = 100;
  const sanitized = name.trim();

  if (sanitized.length < MIN_LENGTH) {
    return {
      isValid: false,
      error: `Track name must be at least ${MIN_LENGTH} characters.`,
    };
  }

  if (sanitized.length > MAX_LENGTH) {
    return {
      isValid: false,
      error: `Track name must be less than ${MAX_LENGTH} characters.`,
    };
  }

  if (!/^[a-zA-Z0-9\s\-_.,!'"`()]+$/.test(sanitized)) {
    return {
      isValid: false,
      error: "Track name contains invalid characters.",
    };
  }

  return {
    isValid: true,
    sanitized,
  };
}
