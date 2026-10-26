"use client";

import { useCallback, useMemo } from "react";

import TrackCardBase from "../TrackCard";

import QueueTrackActions from "./QueueTrackActions";
import QueueTrackDragPreview from "./QueueTrackDragPreview";
import QueueDropIndicatorPortal from "./QueueDropIndicatorPortal";
import useQueueTrackDrag from "./useQueueTrackDrag";
import { getQueueItemId } from "./utils";

export default function QueueTrackItem({
  track,
  state,
  setState,
  handleDrop,
  canDrag = true,
  classNames = {},
}) {
  const {
    cardRef,
    isHovered,
    isDragging,
    dragPosition,
    dragOffset,
    cardRect,
    handleMouseDown,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  } = useQueueTrackDrag({
    track,
    canDrag,
    setState,
    handleDrop,
  });

  const rightContent = useMemo(
    () => <QueueTrackActions track={track} />,
    [track],
  );

  return (
    <div
      ref={cardRef}
      className={`relative w-full transition-all duration-200 ${
        canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      }`}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <TrackCardBase
        track={track}
        className={`hover:bg-muted w-full! rounded-lg p-2 ${
          classNames.QueueTrackItem || ""
        } ${isDragging ? "opacity-50" : "opacity-100"}`}
        rightContent={rightContent}
      />

      {isDragging && (
        <QueueTrackDragPreview
          track={track}
          dragPosition={dragPosition}
          dragOffset={dragOffset}
          width={cardRect?.width}
          rightContent={rightContent}
        />
      )}

      <QueueDropIndicatorPortal
        canDrag={canDrag}
        isHovered={isHovered}
        itemBeingDragged={state.itemBeingDragged}
        placementDrop={state.placementDrop}
        cardRect={cardRect}
      />
    </div>
  );
}
