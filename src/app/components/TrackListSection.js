import TrackList from './TrackList'

export default function TrackListSection({
    trackList,
    setTrackList,
    title,
    emptyMessage,
    className = '',
    collectionPagination,
}) {
    return (
        <div
            className={`flex h-full min-h-0 flex-col overflow-hidden ${className}`}
        >
            <TrackList
                trackList={trackList}
                setTrackList={setTrackList}
                title={title}
                emptyMessage={emptyMessage}
                collectionPagination={collectionPagination}
                className="h-full min-h-0 flex-1"
            />
        </div>
    )
}
