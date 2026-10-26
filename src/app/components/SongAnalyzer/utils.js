export const BPM_RANGES = [
  { value: "50-100", label: "50 to 100" },
  { value: "75-150", label: "75 to 150" },
  { value: "100-200", label: "100 to 200" },
];

export function isAudioFile(file, allowedTypes = []) {
  return Boolean(file?.type && allowedTypes.includes(file.type.toLowerCase()));
}

export function getUploadProgressLabel(progress) {
  return progress === 100 ? "Waiting for server..." : "Sending to server...";
}

export function getAnalysisProgressLabel(progress) {
  return progress === 100 ? "Analysis done." : "Analyzing...";
}
