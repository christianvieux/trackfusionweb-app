import "../../public/css/global.css";
import "../../public/css/shooting_stars.css";

import App from "./components/app";
import { SessionProvider } from "./context/SessionContext";
import { TrackEventsProvider } from "./context/TrackEventsContext";
import { UserInfoProvider } from "./context/UserInfoContext";
import { getSiteUrl } from "./utils/getSiteUrl";

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "TrackFusionWeb",
    template: "%s | TrackFusionWeb",
  },
  description:
    "Upload, discover, play, analyze, save, and share music with TrackFusionWeb.",
  applicationName: "TrackFusionWeb",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "TrackFusionWeb",
    title: "TrackFusionWeb",
    description: "A community platform for discovering and sharing music.",
    url: "/",
    images: ["/images/TrackFusion_Title_Logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrackFusionWeb",
    description: "A community platform for discovering and sharing music.",
    images: ["/images/TrackFusion_Title_Logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a12",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-background min-h-dvh">
        <SessionProvider>
          <UserInfoProvider>
            <TrackEventsProvider>
              <App>{children}</App>
            </TrackEventsProvider>
          </UserInfoProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
