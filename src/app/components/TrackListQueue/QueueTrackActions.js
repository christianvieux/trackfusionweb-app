import TrackOptionsMenu from "../TrackOptionsDropdown";

export default function QueueTrackActions({ track }) {
  return (
    <div className="flex items-center justify-center gap-1">
      <TrackOptionsMenu
        track={track}
        size="sm"
      />
    </div>
  );
}
