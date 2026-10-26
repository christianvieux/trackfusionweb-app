import { getSiteUrl } from "./utils/getSiteUrl";

const publicRoutes = [
  "",
  "/home",
  "/feed",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/login",
  "/signup",
];

export default function sitemap() {
  return publicRoutes.map((route) => ({
    url: getSiteUrl(route),
    changeFrequency: route === "/feed" ? "daily" : "monthly",
    priority: route === "" || route === "/home" ? 1 : 0.7,
  }));
}
