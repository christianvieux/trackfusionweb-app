import { useCallback, useEffect, useRef, useState } from "react";

import useRafDebounce from "./useRafDebounce";
import {
  DRAG_THRESHOLD,
  getDragMovedDistance,
  getDropPlacement,
  isSameQueueItem,
  shouldIgnoreDropPlacement,
} from "./utils";

export default function useQueueTrackDrag({
  track,
  canDrag,
  setState,
  handleDrop,
}) {
  const cardRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressedDown, setIsPressedDown] = useState(false);
  const [initialClickPosition, setInitialClickPosition] = useState({
    x: 0,
    y: 0,
  });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [cardRect, setCardRect] = useState(null);

  const updateDropPlacement = useRafDebounce((event) => {
    if (!canDrag) return;

    setState((previousState) => {
      const draggedTrack = previousState.itemBeingDragged;

      if (!draggedTrack || isSameQueueItem(draggedTrack, track)) {
        return previousState;
      }

      if (shouldIgnoreDropPlacement(event, cardRef.current)) {
        return previousState;
      }

      return {
        ...previousState,
        lastItemHovered: track,
        placementDrop: getDropPlacement(event, cardRef.current),
      };
    });
  });

  const handleMouseEnter = useCallback(
    (event) => {
      setIsHovered(true);
      setCardRect(cardRef.current?.getBoundingClientRect() || null);

      setState((previousState) => {
        const nextState = {
          ...previousState,
          itemHovered: track,
        };

        if (
          !canDrag ||
          !previousState.itemBeingDragged ||
          isSameQueueItem(previousState.itemBeingDragged, track)
        ) {
          return nextState;
        }

        return {
          ...nextState,
          lastItemHovered: track,
          placementDrop: getDropPlacement(event, cardRef.current),
        };
      });
    },
    [track, setState, canDrag],
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);

    setState((previousState) => {
      const nextState = {
        ...previousState,
        itemHovered: null,
      };

      if (!previousState.itemBeingDragged) {
        return nextState;
      }

      return {
        ...nextState,
        lastItemHovered: null,
        placementDrop: null,
      };
    });
  }, [setState]);

  const handleMouseDown = useCallback((event) => {
    event.preventDefault();

    setIsPressedDown(true);
    setInitialClickPosition({
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      updateDropPlacement(event);
    },
    [updateDropPlacement],
  );

  const handleGlobalMouseMove = useCallback(
    (event) => {
      if (!isPressedDown) return;

      const { deltaX, deltaY } = getDragMovedDistance(
        event,
        initialClickPosition,
      );

      const hasMovedPastThreshold =
        deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD;

      if (!hasMovedPastThreshold) return;

      if (canDrag && !isDragging) {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;

        setCardRect(rect);
        setDragOffset({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });

        setIsDragging(true);

        setState((previousState) => ({
          ...previousState,
          itemBeingDragged: track,
          isDragging: true,
        }));
      }

      setDragPosition({
        x: event.clientX,
        y: event.clientY,
      });
    },
    [isPressedDown, initialClickPosition, canDrag, isDragging, track, setState],
  );

  const handleGlobalMouseUp = useCallback(() => {
    setIsPressedDown(false);

    if (isDragging) {
      handleDrop();
    }

    setIsDragging(false);

    setState((previousState) => ({
      ...previousState,
      itemBeingDragged: null,
      isDragging: false,
    }));
  }, [isDragging, handleDrop, setState]);

  useEffect(() => {
    if (!isPressedDown) return;

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isPressedDown, handleGlobalMouseMove, handleGlobalMouseUp]);

  return {
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
  };
}
