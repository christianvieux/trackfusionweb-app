const LOCAL_API_URL = "http://localhost:8081";
const LOOPBACK_HOSTNAMES = new Set(["127.0.0.1", "[::1]", "localhost"]);

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

function getBrowserHostname() {
  return typeof window === "undefined" ? "" : window.location.hostname;
}

export function resolveDevelopmentApiUrl(value, browserHostname) {
  const configuredUrl = normalizeBaseUrl(value);
  const apiUrl = new URL(configuredUrl);
  const hostname = String(browserHostname || "").trim();

  if (!hostname || !LOOPBACK_HOSTNAMES.has(apiUrl.hostname)) {
    return configuredUrl;
  }

  if (
    hostname.includes("/") ||
    hostname.includes("@") ||
    hostname.includes("?") ||
    hostname.includes("#")
  ) {
    throw new Error("Browser hostname must not contain URL components");
  }

  apiUrl.hostname = hostname;
  return apiUrl.origin;
}

export default function getApiBaseUrl(browserHostname = getBrowserHostname()) {
  if (process.env.NODE_ENV !== "production") {
    return resolveDevelopmentApiUrl(
      process.env.NEXT_PUBLIC_API_URL,
      browserHostname,
    );
  }

  return normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL);
}
