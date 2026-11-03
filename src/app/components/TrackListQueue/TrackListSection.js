'use client'

import { memo } from 'react'

import ScrollableContainer from '../ScrollableContainer'
import QueueTrackItem from './QueueTrackItem'
import { getQueueItemId } from './utils'

function TrackListSection({
    title,
    containerId,
    tracks,
    container,
    state,
    setState,
    handleDrop,
    getContainerFromTrack,
    handleDroppableAreaEnter,
    handleDroppableAreaLeave,
    className = '',
    emptyMessage = 'No tracks yet',
}) {
    const isActiveDropArea =
        state.activeDroppableArea === container &&
        state.itemBeingDragged &&
        getContainerFromTrack(state.itemBeingDragged) !== container

    return (
        <section
            id={containerId}
            className={`rounded-md p-1 ${
                isActiveDropArea ? 'outline-primary outline-dashed' : ''
            } ${className}`}
            onMouseEnter={() => handleDroppableAreaEnter(container)}
            onMouseLeave={handleDroppableAreaLeave}
        >
            <p className="text-md mb-3 w-max font-bold text-muted-foreground">
                {title}
            </p>

            <ScrollableContainer
                canScroll={state.itemBeingDragged}
                className="flex h-30 min-h-20 w-full flex-col rounded-lg bg-muted pr-2"
            >
                {tracks.length > 0 ? (
                    tracks.map((track) => (
                        <QueueTrackItem
                            key={getQueueItemId(track)}
                            track={track}
                            state={state}
                            setState={setState}
                            handleDrop={handleDrop}
                        />
                    ))
                ) : (
                    <div className="flex min-h-20 items-center justify-center px-3 text-sm text-muted-foreground">
                        {emptyMessage}
                    </div>
                )}
            </ScrollableContainer>
        </section>
    )
}

export default memo(TrackListSection)
