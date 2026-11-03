import TrackPlayButton from './TrackPlayButton'

export default function PlayPauseButton({
    track,
    className = '',
    size = 'md',
}) {
    return (
        <TrackPlayButton
            track={track}
            playlist={track ? [track] : []}
            className={className}
            size={size}
        />
    )
}
