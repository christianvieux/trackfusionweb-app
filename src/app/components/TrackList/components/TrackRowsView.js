import { memo } from 'react'

import { getCreatorForTrack, getTrackKey } from '../utils'

import TrackListEmptyState from './TrackListEmptyState'
import TrackRowDesktop from './TrackRowDesktop'

function TrackRowsView({ tracks, creatorsById, emptyMessage, onFilter }) {
    return (
        <div role="table" aria-label="Tracks in rows">
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

            <div role="rowgroup" className="track-row-list">
                {tracks.length === 0 ? (
                    <TrackListEmptyState message={emptyMessage} />
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
        </div>
    )
}

export default memo(TrackRowsView)
