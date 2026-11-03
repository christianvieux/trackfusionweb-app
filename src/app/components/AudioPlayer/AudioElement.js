export default function AudioElement({
  audioRef,
  audioSrc,
  isPlaying,
  isLooping,
  onMetadataLoaded,
  onTimeUpdate,
  onBufferingStart,
  onBufferingEnd,
  onEnded,
}) {
  return (
    <audio
      ref={audioRef}
      className="hidden"
      src={audioSrc}
      autoPlay={isPlaying}
      loop={isLooping}
      onLoadedMetadata={onMetadataLoaded}
      onTimeUpdate={onTimeUpdate}
      onWaiting={onBufferingStart}
      onCanPlay={onBufferingEnd}
      onEnded={onEnded}
    >
      Your browser does not support the audio element.
    </audio>
  );
}
