export function replaceArtworkPreviewUrl(currentUrl, file, urlApi = URL) {
  if (currentUrl) urlApi.revokeObjectURL(currentUrl);
  return file ? urlApi.createObjectURL(file) : null;
}

export function revokeArtworkPreviewUrl(currentUrl, urlApi = URL) {
  if (currentUrl) urlApi.revokeObjectURL(currentUrl);
}
