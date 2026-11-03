'use client'

import { GripVertical, X } from 'lucide-react'

import PlayButton from '../PlayButton'
import ScrollableContainer from '../ScrollableContainer'
import TrackOptionsDropdown from '../TrackOptionsDropdown'
import TrackVisual from '../TrackList/components/TrackVisual'
import useTrackCreators from '../TrackList/hooks/useTrackCreators'
import { getCreatorForTrack } from '../TrackList/utils'
import { formatDuration } from '../../utils/audio'

import QueueDropIndicatorPortal from './QueueDropIndicatorPortal'
import QueueTrackDragPreview from './QueueTrackDragPreview'
import useQueueTrackDrag from './useQueueTrackDrag'
import { getQueueItemId } from './utils'

function StageQueueItem({
    track,
    creator,
    state,
    setState,
    handleDrop,
    onRemove,
    onSelect,
}) {
    const name = track.name || 'Unknown track'
    const {
        cardRef,
        isHovered,
        isDragging,
        dragPosition,
        dragOffset,
        cardRect,
        handleMouseDown,
        handleMouseEnter,
        handleMouseLeave,
        handleMouseMove,
    } = useQueueTrackDrag({
        track,
        canDrag: true,
        setState,
        handleDrop,
    })

    return (
        <div
            ref={cardRef}
            className={`stage-queue-item cursor-grab active:cursor-grabbing ${
                isDragging ? 'is-dragging' : ''
            }`}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            <GripVertical
                className="stage-queue-grip size-4 shrink-0"
                aria-hidden="true"
            />
            <PlayButton
                size="sm"
                label={name}
                style={{ '--play-button-size': '30px' }}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                    event.stopPropagation()
                    onSelect(track)
                }}
            />
            <TrackVisual
                track={track}
                creator={creator}
                className="size-8 rounded-md"
                avatarClassName="size-2/3"
                sizes="32px"
            />
            <div className="min-w-0">
                <p
                    className="stage-queue-title truncate text-[.78rem] font-bold leading-tight text-foreground"
                    title={name}
                >
                    {name}
                </p>
                <p
                    className="truncate text-[.68rem] leading-tight text-muted-foreground"
                    title={creator?.username || track.artist || 'Unknown creator'}
                >
                    {creator?.username || track.artist || 'Unknown creator'} ·{' '}
                    {formatDuration(track.length)}
                </p>
            </div>
            <button
                type="button"
                aria-label={`Remove ${name}`}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                    event.stopPropagation()
                    onRemove(track)
                }}
                className="stage-queue-remove"
            >
                <X className="size-4" />
            </button>
            <div
                className="stage-queue-options"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
            >
                <TrackOptionsDropdown
                    track={track}
                    creator={creator}
                    className="size-7"
                    triggerClassName="size-7 rounded-md text-[var(--stage-accent-light)] hover:bg-[rgb(52_211_153_/_0.1)]"
                />
            </div>

            {isDragging && (
                <QueueTrackDragPreview
                    track={track}
                    dragPosition={dragPosition}
                    dragOffset={dragOffset}
                    width={cardRect?.width}
                />
            )}

            <QueueDropIndicatorPortal
                canDrag
                isHovered={isHovered}
                itemBeingDragged={state.itemBeingDragged}
                placementDrop={state.placementDrop}
                cardRect={cardRect}
            />
        </div>
    )
}

function StageQueueSection({
    title,
    tracks,
    container,
    emptyMessage,
    onRemove,
    onSelect,
    creatorsById,
    state,
    setState,
    handleDrop,
    getContainerFromTrack,
    handleDroppableAreaEnter,
    handleDroppableAreaLeave,
}) {
    const isActiveDropArea =
        state.activeDroppableArea === container &&
        state.itemBeingDragged &&
        getContainerFromTrack(state.itemBeingDragged) !== container

    return (
        <section
            className={`stage-queue-section ${
                isActiveDropArea ? 'is-drop-target' : ''
            }`}
            onMouseEnter={() => handleDroppableAreaEnter(container)}
            onMouseLeave={handleDroppableAreaLeave}
        >
            <h3>{title}</h3>
            {tracks.length > 0 ? (
                <div className="stage-queue-list">
                    {tracks.map((track) => (
                        <StageQueueItem
                            key={getQueueItemId(track)}
                            track={track}
                            creator={getCreatorForTrack(creatorsById, track)}
                            state={state}
                            setState={setState}
                            handleDrop={handleDrop}
                            onRemove={onRemove}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            ) : (
                <p className="stage-queue-empty">{emptyMessage}</p>
            )}
        </section>
    )
}

export default function StageQueuePanel({
    queue,
    playlist,
    upcomingPlaylistTracks,
    onRemoveFromQueue,
    onRemoveFromPlaylist,
    onSelectTrack,
    onClear,
    ...dragProps
}) {
    const upcomingTracks = [...queue, ...upcomingPlaylistTracks]
    const creatorsById = useTrackCreators(upcomingTracks)

    return (
        <section className="stage-queue" aria-label="Playback queue">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-[.78rem] font-bold tracking-[.06em] text-muted-foreground uppercase">
                    Up next · {upcomingTracks.length}
                </h2>
                {upcomingTracks.length > 0 && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="min-h-9 rounded-lg px-2 text-sm text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Clear
                    </button>
                )}
            </div>

            <ScrollableContainer
                canScroll={Boolean(dragProps.state?.itemBeingDragged)}
                className="stage-queue-sections"
                data-edge-scroll-container="playback-queue"
            >
                <StageQueueSection
                    title="Queue"
                    tracks={queue}
                    container={queue}
                    emptyMessage="Drag a track here to play it first."
                    onRemove={onRemoveFromQueue}
                    onSelect={onSelectTrack}
                    creatorsById={creatorsById}
                    {...dragProps}
                />
                <StageQueueSection
                    title="Next from playlist"
                    tracks={upcomingPlaylistTracks}
                    container={playlist}
                    emptyMessage="No playlist tracks are coming up."
                    onRemove={onRemoveFromPlaylist}
                    onSelect={onSelectTrack}
                    creatorsById={creatorsById}
                    {...dragProps}
                />
            </ScrollableContainer>
        </section>
    )
}
