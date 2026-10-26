// context/TrackListContext.js

import React, { createContext, useState, useContext, useMemo } from "react";

const TrackListContext = createContext({
  trackList: [],
  setTrackList: () => {},
});

export const TrackListProvider = ({ children, initialTrackList = [] }) => {
  const [trackList, setTrackList] = useState(initialTrackList);
  const value = useMemo(() => ({ trackList, setTrackList }), [trackList]);

  return (
    <TrackListContext.Provider value={value}>
      {children}
    </TrackListContext.Provider>
  );
};

export const useTrackList = () => useContext(TrackListContext);
