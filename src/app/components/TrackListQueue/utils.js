export const DRAG_THRESHOLD = 5;

export function getQueueItemId(track) {
  return track?.uniqueId;
}

export function getAudioTrackId(track) {
  return track?.trackId ?? track?.id;
}

export function isSameAudioTrack(trackA, trackB) {
  const trackAId = getAudioTrackId(trackA);
  const trackBId = getAudioTrackId(trackB);

  return trackAId != null && trackBId != null && String(trackAId) === String(trackBId);
}

export function createQueueTrack(track) {
  const audioTrackId = getAudioTrackId(track);

  return {
    ...track,
    trackId: audioTrackId,
    uniqueId:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${audioTrackId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  };
}

export function isSameQueueItem(trackA, trackB) {
  return getQueueItemId(trackA) === getQueueItemId(trackB);
}

export function getDropPlacement(event, cardElement) {
  if (!cardElement) return null;

  const rect = cardElement.getBoundingClientRect();
  const mouseY = event.clientY;
  const cardCenterY = rect.top + rect.height / 2;

  return mouseY < cardCenterY ? "above" : "below";
}

export function shouldIgnoreDropPlacement(event, cardElement) {
  if (!cardElement) return true;

  const rect = cardElement.getBoundingClientRect();
  const mouseY = event.clientY;
  const bufferSize = rect.height * 0.1;

  return mouseY < rect.top + bufferSize || mouseY > rect.bottom - bufferSize;
}

export function getDragMovedDistance(event, initialPosition) {
  return {
    deltaX: Math.abs(event.clientX - initialPosition.x),
    deltaY: Math.abs(event.clientY - initialPosition.y),
  };
}

export function insertQueueItem({
  sourceList,
  targetList,
  queueItem,
  targetQueueItem,
  placement,
}) {
  const queueItemId = getQueueItemId(queueItem);
  const targetQueueItemId = getQueueItemId(targetQueueItem);
  const isSameList = sourceList === targetList;

  const nextSourceList = sourceList.filter(
    (item) => getQueueItemId(item) !== queueItemId,
  );

  const nextTargetList = isSameList ? nextSourceList : targetList;

  if (!targetQueueItem) {
    return {
      sourceList: nextSourceList,
      targetList: [...nextTargetList, queueItem],
    };
  }

  const targetIndex = nextTargetList.findIndex(
    (item) => getQueueItemId(item) === targetQueueItemId,
  );

  if (targetIndex === -1) {
    return {
      sourceList: nextSourceList,
      targetList: [...nextTargetList, queueItem],
    };
  }

  const insertIndex = placement === "above" ? targetIndex : targetIndex + 1;

  return {
    sourceList: nextSourceList,
    targetList: [
      ...nextTargetList.slice(0, insertIndex),
      queueItem,
      ...nextTargetList.slice(insertIndex),
    ],
  };
}
