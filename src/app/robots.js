import { getSiteUrl } from "./utils/getSiteUrl";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/settings", "/upload", "/myTracks", "/myFavoriteTracks"],
    },
    sitemap: getSiteUrl("/sitemap.xml"),
  };
}
