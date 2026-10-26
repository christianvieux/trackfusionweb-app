"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";

const PlaybackContext = createContext(undefined);

const allowedPlaybackPaths = [
  "/feed",
  "/track",
  "/playlist",
  "/profile",
  "/myTracks",
  "/myFavoriteTracks",
];

function pathSupportsPlayback(pathname) {
  return allowedPlaybackPaths.some(
    (basePath) => pathname === basePath || pathname.startsWith(`${basePath}/`),
  );
}

export function PlaybackProvider({ children }) {
  const pathname = usePathname();

  return (
    <PlaybackContext.Provider
      value={{
        canShowPlayback: pathSupportsPlayback(pathname),
        allowedPlaybackPaths,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  const context = useContext(PlaybackContext);

  if (!context) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }

  return context;
}
