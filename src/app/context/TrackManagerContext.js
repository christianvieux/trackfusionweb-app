"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";

import { useTrackEvents } from "./TrackEventsContext";

const TrackManagerContext = createContext(undefined);

export function TrackManagerProvider({ children }) {
  const { lastUpdatedTrack, lastDeletedTrackId } = useTrackEvents();

  const [initialPlaylist, setInitialPlaylist] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrackReadyInPlayer, setIsTrackReadyInPlayer] = useState(false);

  const audioRef = React.useRef(null);

  function generateUniqueId() {
    return crypto.randomUUID();
  }

  function assignUniqueIdsTo(tracks = []) {
    return tracks.map((track) => ({
      ...track,
      trackId: track.trackId ?? track.id,
      uniqueId: track.uniqueId || generateUniqueId(),
    }));
  }

  function updateTrackCollection(currentTracks = [], updatedTrack) {
    return currentTracks.map((track) =>
      Number(track.id) === Number(updatedTrack.id)
        ? { ...track, ...updatedTrack }
        : track,
    );
  }

  function removeTrackFromCollection(currentTracks = [], trackId) {
    return currentTracks.filter(
      (track) => Number(track.id) !== Number(trackId),
    );
  }

  function initializePlaylist(tracks = []) {
    const tracksWithIds = assignUniqueIdsTo(tracks);
    setInitialPlaylist(tracksWithIds);

    return tracksWithIds;
  }

  function shuffleArray(array = [], startingItem = null) {
    const newArray = [...array];

    if (startingItem) {
      const startingIndex = newArray.findIndex(
        (track) => track.uniqueId === startingItem.uniqueId,
      );

      if (startingIndex !== -1) {
        newArray.splice(startingIndex, 1);
      }
    }

    for (let index = newArray.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [newArray[index], newArray[randomIndex]] = [
        newArray[randomIndex],
        newArray[index],
      ];
    }

    if (startingItem) {
      newArray.unshift(startingItem);
    }

    return newArray;
  }

  function resumeTrack() {
    setIsPlaying(true);
  }

  function pauseTrack() {
    setIsPlaying(false);
  }

  function startPlaylist(tracks = [], startingTrack = null, canPlay = true) {
    if (!tracks.length) return null;

    const initialTracksWithIds = initializePlaylist(tracks);

    let nextPlaylist = initialTracksWithIds;
    let startingTrackWithId = null;

    if (startingTrack) {
      startingTrackWithId = initialTracksWithIds.find(
        (track) => Number(track.id) === Number(startingTrack.id),
      );
    }

    if (isShuffled) {
      nextPlaylist = shuffleArray(nextPlaylist, startingTrackWithId);
    }

    const nextTrackIndex = startingTrackWithId
      ? nextPlaylist.findIndex(
          (track) => track.uniqueId === startingTrackWithId.uniqueId,
        )
      : 0;

    const safeTrackIndex = nextTrackIndex === -1 ? 0 : nextTrackIndex;
    const nextTrack = nextPlaylist[safeTrackIndex];

    setPlaylist(nextPlaylist);
    setCurrentTrackIndex(safeTrackIndex);
    setCurrentTrack(nextTrack);

    if (canPlay) {
      resumeTrack();
    }

    return nextTrack;
  }

  function playNextTrack() {
    const nextTrackInQueue = queue[0];

    if (nextTrackInQueue) {
      setQueue((currentQueue) => currentQueue.slice(1));
      setCurrentTrack(nextTrackInQueue);
      setIsPlaying(true);

      return nextTrackInQueue;
    }

    if (!playlist.length) {
      setCurrentTrack(null);
      setIsPlaying(false);
      return null;
    }

    const nextTrackIndex =
      currentTrackIndex + 1 < playlist.length ? currentTrackIndex + 1 : 0;

    const nextTrack = playlist[nextTrackIndex];

    setCurrentTrackIndex(nextTrackIndex);
    setCurrentTrack(nextTrack);
    setIsPlaying(true);

    return nextTrack;
  }

  function playPreviousTrack() {
    if (!playlist.length) return null;

    const restartThreshold = 2;
    const currentPosition = audioRef.current?.currentTime || 0;

    if (currentPosition > restartThreshold) {
      audioRef.current.currentTime = 0;
      return currentTrack;
    }

    const previousTrackIndex =
      currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;

    const previousTrack = playlist[previousTrackIndex];

    setCurrentTrackIndex(previousTrackIndex);
    setCurrentTrack(previousTrack);
    setIsPlaying(true);

    return previousTrack;
  }

  function shufflePlaylist() {
    if (!currentTrack || !playlist.length) return;

    const shuffledPlaylist = shuffleArray(playlist, currentTrack);

    setPlaylist(shuffledPlaylist);
    setCurrentTrackIndex(0);
    setCurrentTrack(shuffledPlaylist[0]);
    setIsShuffled(true);
  }

  function resetPlaylist() {
    if (!currentTrack || !initialPlaylist.length) return;

    const nextTrackIndex = initialPlaylist.findIndex(
      (track) => track.uniqueId === currentTrack.uniqueId,
    );

    setPlaylist(initialPlaylist);
    setCurrentTrackIndex(nextTrackIndex === -1 ? 0 : nextTrackIndex);
    setIsShuffled(false);
  }

  function skipToTrack(uniqueId) {
    const queuedTrackIndex = queue.findIndex(
      (track) => track.uniqueId === uniqueId,
    );

    if (queuedTrackIndex !== -1) {
      const selectedTrack = queue[queuedTrackIndex];

      setQueue((currentQueue) => currentQueue.slice(queuedTrackIndex + 1));
      setCurrentTrack(selectedTrack);
      resumeTrack();

      return selectedTrack;
    }

    const playlistTrackIndex = playlist.findIndex(
      (track) => track.uniqueId === uniqueId,
    );

    if (playlistTrackIndex !== -1) {
      const selectedTrack = playlist[playlistTrackIndex];

      setCurrentTrackIndex(playlistTrackIndex);
      setCurrentTrack(selectedTrack);
      resumeTrack();

      return selectedTrack;
    }

    console.error(`Track with uniqueId ${uniqueId} was not found.`);
    return null;
  }

  function createTrackInstance(track) {
    return {
      ...track,
      trackId: track.trackId ?? track.id,
      uniqueId: generateUniqueId(),
    };
  }

  function addTrackInstance(track, setCollection) {
    const newTrack = createTrackInstance(track);

    setCollection((currentTracks) => [...currentTracks, newTrack]);

    return newTrack;
  }

  function addTrackToPlaylist(track) {
    return addTrackInstance(track, setPlaylist);
  }

  function addTrackToQueue(track) {
    return addTrackInstance(track, setQueue);
  }

  function removeTrackByUniqueId(uniqueId, setCollection) {
    setCollection((currentTracks) =>
      currentTracks.filter((track) => track.uniqueId !== uniqueId),
    );
  }

  function removeTrackFromPlaylist(uniqueId) {
    removeTrackByUniqueId(uniqueId, setPlaylist);
  }

  function removeTrackFromQueue(uniqueId) {
    removeTrackByUniqueId(uniqueId, setQueue);
  }

  function removeTrackFromManager(trackId) {
    setInitialPlaylist((currentTracks) =>
      removeTrackFromCollection(currentTracks, trackId),
    );

    setPlaylist((currentTracks) =>
      removeTrackFromCollection(currentTracks, trackId),
    );

    setQueue((currentTracks) =>
      removeTrackFromCollection(currentTracks, trackId),
    );

    setCurrentTrack((currentTrack) => {
      if (Number(currentTrack?.id) !== Number(trackId)) {
        return currentTrack;
      }

      setIsPlaying(false);
      return null;
    });
  }

  const playNextTrackOnQueueChange = useEffectEvent(() => {
    playNextTrack();
  });

  const removeDeletedTrack = useEffectEvent((trackId) => {
    removeTrackFromManager(trackId);
  });

  useEffect(() => {
    if (queue.length > 0 && !currentTrack && playlist.length === 0) {
      playNextTrackOnQueueChange();
    }
  }, [queue, currentTrack, playlist.length]);

  useEffect(() => {
    if (!lastDeletedTrackId?.trackId) return;

    removeDeletedTrack(lastDeletedTrackId.trackId);
  }, [lastDeletedTrackId]);

  useEffect(() => {
    if (!lastUpdatedTrack?.track) return;

    const updatedTrack = lastUpdatedTrack.track;

    setInitialPlaylist((currentTracks) =>
      updateTrackCollection(currentTracks, updatedTrack),
    );

    setPlaylist((currentTracks) =>
      updateTrackCollection(currentTracks, updatedTrack),
    );

    setQueue((currentTracks) =>
      updateTrackCollection(currentTracks, updatedTrack),
    );

    setCurrentTrack((currentTrack) =>
      Number(currentTrack?.id) === Number(updatedTrack.id)
        ? { ...currentTrack, ...updatedTrack }
        : currentTrack,
    );
  }, [lastUpdatedTrack]);

  const contextValue = {
    audioRef,

    isPlaying,
    setIsPlaying,
    resumeTrack,
    pauseTrack,

    isShuffled,
    setIsShuffled,

    isTrackReadyInPlayer,
    setIsTrackReadyInPlayer,

    initialPlaylist,
    initializePlaylist,

    playlist,
    setPlaylist,
    startPlaylist,
    shufflePlaylist,
    resetPlaylist,

    queue,
    setQueue,
    addTrackToQueue,
    removeTrackFromQueue,

    currentTrack,
    setCurrentTrack,

    currentTrackIndex,
    setCurrentTrackIndex,

    playNextTrack,
    playPreviousTrack,
    skipToTrack,

    addTrackToPlaylist,
    removeTrackFromPlaylist,
    removeTrackFromManager,
  };

  return (
    <TrackManagerContext.Provider value={contextValue}>
      {children}
    </TrackManagerContext.Provider>
  );
}

export function useTrackManager() {
  const context = useContext(TrackManagerContext);

  if (!context) {
    throw new Error(
      "useTrackManager must be used within a TrackManagerProvider",
    );
  }

  return context;
}
