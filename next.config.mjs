function getRemoteImagePatterns() {
  const configuredDomains =
    process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS?.split(",") ?? [];

  return configuredDomains
    .map((domain) => domain.trim())
    .filter(Boolean)
    .map((domain) => {
      const url = new URL(
        domain.includes("://") ? domain : `https://${domain}`,
      );

      return {
        protocol: url.protocol.replace(":", ""),
        hostname: url.hostname,
        port: url.port,
        pathname: "/**",
      };
    });
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=()",
  },
];

if (process.env.NODE_ENV === "production") {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=31536000",
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: getRemoteImagePatterns(),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
