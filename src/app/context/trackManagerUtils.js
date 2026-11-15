import { createUuid } from "../utils/createUuid";

export function createTrackInstance(track = {}) {
  return {
    ...track,
    trackId: track.trackId ?? track.id,
    uniqueId: createUuid(),
  };
}

export function assignUniqueIdsTo(tracks = []) {
  return tracks.map((track) => ({
    ...track,
    trackId: track.trackId ?? track.id,
    uniqueId: track.uniqueId || createUuid(),
  }));
}
