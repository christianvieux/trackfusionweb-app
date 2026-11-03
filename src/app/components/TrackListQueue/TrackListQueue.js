"use client";

import React, { memo, useCallback, useMemo } from "react";

import ScrollableContainer from "../ScrollableContainer";
import { usePlayback } from "../../context/PlaybackContext";
import { useTrackManager } from "../../context/TrackManagerContext";

import TrackListSection from "./TrackListSection";
import StageQueuePanel from "./StageQueuePanel";
import useDragAndDrop from "./useDragAndDrop";
import { getQueueItemId, insertQueueItem } from "./utils";

function TrackListQueue({ classNames = {}, variant = "default", onClear }) {
  const {
    currentTrack,
    queue,
    setQueue,
    playlist,
    setPlaylist,
    initializePlaylist,
    removeTrackFromQueue,
    removeTrackFromPlaylist,
    skipToTrack,
  } = useTrackManager();

  const { canShowPlayback } = usePlayback();

  const getContainerFromTrack = useCallback(
    (track) => {
      const queueItemId = getQueueItemId(track);

      if (queue.some((item) => getQueueItemId(item) === queueItemId)) {
        return queue;
      }

      if (playlist.some((item) => getQueueItemId(item) === queueItemId)) {
        return playlist;
      }

      return null;
    },
    [queue, playlist],
  );

  const updateContainers = useCallback(
    ({ sourceContainer, nextSource, nextTarget }) => {
      if (sourceContainer === queue) {
        setQueue(nextSource);
        setPlaylist(nextTarget);
        return;
      }

      setPlaylist(nextSource);
      setQueue(nextTarget);
    },
    [queue, setQueue, setPlaylist],
  );

  const moveQueueItem = useCallback(
    (fromTrack, toTrack, placement, targetContainer) => {
      if (!fromTrack) return;

      const sourceContainer = getContainerFromTrack(fromTrack);
      const destinationContainer = toTrack
        ? getContainerFromTrack(toTrack)
        : targetContainer;

      if (!sourceContainer || !destinationContainer) return;

      const isSameItem =
        toTrack && getQueueItemId(fromTrack) === getQueueItemId(toTrack);

      const isSameContainer = sourceContainer === destinationContainer;

      if (isSameItem && isSameContainer) return;

      const { sourceList, targetList } = insertQueueItem({
        sourceList: sourceContainer,
        targetList: destinationContainer,
        queueItem: fromTrack,
        targetQueueItem: toTrack,
        placement,
      });

      if (isSameContainer) {
        if (sourceContainer === queue) {
          setQueue(targetList);
        } else {
          setPlaylist(targetList);
        }

        return;
      }

      updateContainers({
        sourceContainer,
        nextSource: sourceList,
        nextTarget: targetList,
      });
    },
    [queue, getContainerFromTrack, setQueue, setPlaylist, updateContainers],
  );

  const [
    state,
    setState,
    handleDrop,
    handleDroppableAreaEnter,
    handleDroppableAreaLeave,
  ] = useDragAndDrop(moveQueueItem);

  const upcomingPlaylistTracks = useMemo(() => {
    if (!currentTrack) return playlist;

    const currentIndex = playlist.findIndex(
      (track) => getQueueItemId(track) === getQueueItemId(currentTrack),
    );

    if (currentIndex === -1) return playlist;

    return playlist.slice(currentIndex + 1);
  }, [playlist, currentTrack]);

  const sharedListProps = {
    state,
    setState,
    handleDrop,
    getContainerFromTrack,
    handleDroppableAreaEnter,
    handleDroppableAreaLeave,
  };

  if (!canShowPlayback) return null;

  if (variant === "stage") {
    return (
      <StageQueuePanel
        queue={queue}
        playlist={playlist}
        upcomingPlaylistTracks={upcomingPlaylistTracks}
        onRemoveFromQueue={(track) => removeTrackFromQueue(track.uniqueId)}
        onRemoveFromPlaylist={(track) =>
          removeTrackFromPlaylist(track.uniqueId)
        }
        onSelectTrack={(track) => skipToTrack(track.uniqueId)}
        onClear={() => {
          setQueue([]);
          setPlaylist([]);
          initializePlaylist([]);
          onClear?.();
        }}
        {...sharedListProps}
      />
    );
  }

  return (
      <div
          id="track-list-queue"
          className="h-95 max-w-full max-h-full rounded-md border-1 border-accent/20 bg-secondary p-0"
      >
          <ScrollableContainer
              canScroll={state.itemBeingDragged}
              className={`flex flex-col gap-2 p-4 ${classNames.Base || ''}`}
          >
              {queue.length > 0 && (
                  <TrackListSection
                      title="Queue"
                      containerId="Queue"
                      tracks={queue}
                      container={queue}
                      emptyMessage="No tracks yet"
                      {...sharedListProps}
                  />
              )}

              <TrackListSection
                  title="Next from Playlist"
                  containerId="Playlist"
                  tracks={upcomingPlaylistTracks}
                  container={playlist}
                  emptyMessage = "No tracks yet"
                  {...sharedListProps}
              />
          </ScrollableContainer>
      </div>
  )
}

export default memo(TrackListQueue);
