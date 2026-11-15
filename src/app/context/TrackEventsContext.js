"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { createUuid } from "../utils/createUuid";

const TrackEventsContext = createContext(null);

export function TrackEventsProvider({ children }) {
  const [lastUpdatedTrack, setLastUpdatedTrack] = useState(null);
  const [lastDeletedTrackId, setLastDeletedTrackId] = useState(null);

  function notifyTrackUpdated(track) {
    setLastUpdatedTrack({
      track,
      eventId: createUuid(),
    });
  }

  function notifyTrackDeleted(trackId) {
    setLastDeletedTrackId({
      trackId: Number(trackId),
      eventId: createUuid(),
    });
  }

  const value = useMemo(
    () => ({
      lastUpdatedTrack,
      lastDeletedTrackId,
      notifyTrackUpdated,
      notifyTrackDeleted,
    }),
    [lastUpdatedTrack, lastDeletedTrackId]
  );

  return (
    <TrackEventsContext.Provider value={value}>
      {children}
    </TrackEventsContext.Provider>
  );
}

export function useTrackEvents() {
  const context = useContext(TrackEventsContext);

  if (!context) {
    throw new Error("useTrackEvents must be used inside TrackEventsProvider");
  }

  return context;
}
