const HTTP_PROTOCOLS = new Set(["http:", "https:"]);
const LOCAL_IMAGE_HOSTS = new Set(["127.0.0.1", "[::1]", "localhost"]);

function entries(value) {
  return String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseExactOrigin(
  value,
  variableName,
  { allowBareHostname = false } = {},
) {
  const candidate =
    allowBareHostname && !value.includes("://") ? `https://${value}` : value;

  let url;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error(
      `${variableName} must contain comma-separated HTTP(S) origins`,
    );
  }

  if (
    !HTTP_PROTOCOLS.has(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      `${variableName} entries must be exact HTTP(S) origins without credentials, paths, queries, or fragments`,
    );
  }

  return url;
}

export function resolveRemoteImageConfig(environment = process.env) {
  const configuredOrigins = entries(environment.NEXT_IMAGE_REMOTE_ORIGINS).map(
    (origin) => parseExactOrigin(origin, "NEXT_IMAGE_REMOTE_ORIGINS"),
  );

  // Preserve deployed environments during the variable-name migration. New
  // configuration should use NEXT_IMAGE_REMOTE_ORIGINS so protocol and port
  // are always explicit.
  const legacyOrigins = entries(
    environment.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS,
  ).map((domain) =>
    parseExactOrigin(domain, "NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS", {
      allowBareHostname: true,
    }),
  );

  const origins = [
    ...new Map(
      [...configuredOrigins, ...legacyOrigins].map((url) => [url.origin, url]),
    ).values(),
  ];

  const remotePatterns = origins.map((url) => ({
    protocol: url.protocol.slice(0, -1),
    hostname: url.hostname,
    port: url.port,
    pathname: "/**",
  }));

  const includesLocalOrigin = origins.some((url) =>
    LOCAL_IMAGE_HOSTS.has(url.hostname),
  );

  return {
    remotePatterns,
    // Next.js 16 blocks optimizer requests to loopback addresses by default.
    // This exception is intentionally impossible to enable in production.
    dangerouslyAllowLocalIP:
      environment.NODE_ENV !== "production" && includesLocalOrigin,
  };
}
