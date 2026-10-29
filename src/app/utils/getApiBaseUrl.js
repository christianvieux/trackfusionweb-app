const LOCAL_API_URL = "http://localhost:8081";

export function normalizeBaseUrl(value) {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) return LOCAL_API_URL;

  try {
    const url = new URL(normalizedValue);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("API URL must use HTTP or HTTPS");
    }

    if (
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      throw new Error("API URL must be an origin without credentials or a path");
    }

    return url.origin;
  } catch {
    throw new Error(
      "NEXT_PUBLIC_API_URL must be an absolute HTTP(S) URL, such as https://api.trackfusionweb.com",
    );
  }
}

export default function getApiBaseUrl() {
  return normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL);
}
