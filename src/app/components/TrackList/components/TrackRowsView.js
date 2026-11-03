import { getCreatorForTrack, getTrackKey } from '../utils'

import TrackListEmptyState from './TrackListEmptyState'
import TrackRowDesktop from './TrackRowDesktop'

export default function TrackRowsView({
    tracks,
    creatorsById,
    emptyMessage,
    onFilter,
}) {
    return (
        <div role="table" aria-label="Tracks in rows" className="space-y-0.5">
            <div role="row" className="track-row-grid track-row-header">
                <span aria-hidden="true" />
                <span role="columnheader">Name</span>
                <span className="track-row-tags" role="columnheader">
                    Tags
                </span>
                <span role="columnheader">Creator</span>
                <span role="columnheader">Time</span>
                <span aria-hidden="true" />
                <span aria-hidden="true" />
            </div>

            {tracks.length === 0 ? (
                <TrackListEmptyState
                    message={emptyMessage}
                    className="mt-3"
                />
            ) : (
                tracks.map((track, index) => (
                    <TrackRowDesktop
                        key={getTrackKey(track, index)}
                        track={track}
                        creator={getCreatorForTrack(creatorsById, track)}
                        paginatedTracks={tracks}
                        onFilter={onFilter}
                    />
                ))
            )}
        </div>
    )
}
