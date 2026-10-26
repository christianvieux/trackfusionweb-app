const LOCAL_SITE_URL = "http://localhost:3001";
const PRODUCTION_SITE_URL = "https://trackfusionweb.com";

export function normalizeSiteUrl(value) {
  const fallback =
    process.env.NODE_ENV === "production"
      ? PRODUCTION_SITE_URL
      : LOCAL_SITE_URL;
  const normalizedValue = String(value || fallback).trim();

  try {
    const url = new URL(normalizedValue);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Site URL must use HTTP or HTTPS");
    }

    if (
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      throw new Error("Site URL must be an origin without credentials or a path");
    }

    return url.origin;
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an absolute HTTP(S) URL, such as https://trackfusionweb.com",
    );
  }
}

export function getSiteUrl(path = "") {
  const baseUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const normalizedPath = path ? `/${String(path).replace(/^\/+/, "")}` : "";

  return `${baseUrl}${normalizedPath}`;
}
