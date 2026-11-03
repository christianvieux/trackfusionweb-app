import TrackList from './TrackList'

export default function TrackListSection({
    trackList,
    setTrackList,
    title,
    emptyMessage,
    className = '',
}) {
    return (
        <div className={`h-max min-h-0 overflow-hidden ${className}`}>
            <TrackList
                trackList={trackList}
                setTrackList={setTrackList}
                title={title}
                emptyMessage={emptyMessage}
                className="min-h-0 flex-1"
            />
        </div>
    )
}
