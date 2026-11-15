import os from "node:os";

const DEFAULT_BROWSER_ORIGIN = "http://localhost:3000";

function parseBrowserOrigin(origin, variableName) {
  let value;
  try {
    value = new URL(origin);
  } catch {
    throw new Error(`${variableName} must contain valid HTTP(S) origins`);
  }

  if (
    !["http:", "https:"].includes(value.protocol) ||
    value.username ||
    value.password ||
    value.pathname !== "/" ||
    value.search ||
    value.hash
  ) {
    throw new Error(
      `${variableName} must contain exact HTTP(S) origins without paths`,
    );
  }

  return value;
}

export function resolveAllowedDevOrigins(
  environment = process.env,
  networkInterfaces,
) {
  if (environment.NODE_ENV === "production") return [];

  const configuredOrigins =
    environment.ALLOWED_BROWSER_ORIGINS || DEFAULT_BROWSER_ORIGIN;
  const origins = configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => parseBrowserOrigin(origin, "ALLOWED_BROWSER_ORIGINS"));

  const availableInterfaces = networkInterfaces || os.networkInterfaces();

  return [
    ...new Set([
      new URL(DEFAULT_BROWSER_ORIGIN).hostname,
      ...origins.map((origin) => origin.hostname),
      ...Object.values(availableInterfaces)
        .flatMap((addresses) => addresses || [])
        .filter((address) => !address.internal)
        .map((address) =>
          address.family === "IPv6" || address.family === 6
            ? `[${address.address}]`
            : address.address,
        )
        .filter(Boolean),
    ]),
  ];
}
