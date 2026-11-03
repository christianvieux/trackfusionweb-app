'use client'

import { memo, useState } from 'react'
import Link from 'next/link'
import { useTrackManager } from '../../../context/TrackManagerContext'

import FavoriteButton from '../../FavoriteButton'
import TrackOptionsDropdown from '../../TrackOptionsDropdown'
import TrackPlayButton from '../../TrackPlayButton'
import { formatDuration } from '../../../utils/audio'
import {
    getCreatorDisplayName,
    getCreatorForTrack,
    getTrackKey,
} from '../utils'

import TrackAttributePills from './TrackAttributePills'
import TrackCreatorLink from './TrackCreatorLink'
import TrackListEmptyState from './TrackListEmptyState'
import TrackVisual from './TrackVisual'

function TrackSpotlightView({ tracks, creatorsById, emptyMessage, onFilter }) {
    const { currentTrack } = useTrackManager()
    const [selectedTrackKey, setSelectedTrackKey] = useState(null)
    const [isInteracting, setIsInteracting] = useState(false)
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)

    if (tracks.length === 0) {
        return <TrackListEmptyState message={emptyMessage} />
    }

    const selectedTrack =
        tracks.find(
            (track, index) =>
                String(getTrackKey(track, index)) === String(selectedTrackKey)
        ) || tracks[0]
    const selectedCreator = getCreatorForTrack(creatorsById, selectedTrack)
    const shouldAnimateAvatar = isInteracting || isOptionsOpen
    return (
        <div aria-label="Tracks in spotlight" className="track-spotlight-grid">
            <article
                className={`track-spotlight-hero min-w-0 rounded-[14px] border p-3 ${
                    currentTrack?.id != null &&
                    String(currentTrack.id) === String(selectedTrack.id)
                        ? 'is-current'
                        : ''
                }`}
                onPointerEnter={() => setIsInteracting(true)}
                onPointerLeave={() => setIsInteracting(false)}
                onFocus={() => setIsInteracting(true)}
                onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                        setIsInteracting(false)
                    }
                }}
            >
                <TrackVisual
                    track={selectedTrack}
                    creator={selectedCreator}
                    animateAvatar={shouldAnimateAvatar}
                    className="track-spotlight-visual aspect-square rounded-[10px]"
                    avatarClassName="size-1/2"
                    sizes="(max-width: 1024px) 90vw, 420px"
                />

                <div className="track-spotlight-details min-w-0">
                    <Link
                        href={`/track/${selectedTrack.id}`}
                        className="block truncate text-lg font-bold text-foreground transition-colors hover:text-primary"
                    >
                        {selectedTrack.name || 'Unknown track'}
                    </Link>

                    <TrackCreatorLink
                        creator={selectedCreator}
                        userId={selectedTrack.creator_id}
                        animate={shouldAnimateAvatar}
                        className="mt-1 max-w-full"
                        avatarClassName="size-5"
                        nameClassName="text-sm font-semibold"
                    />

                    <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate">
                            {selectedTrack.artist || 'Unknown artist'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="shrink-0">
                            {formatDuration(selectedTrack.length)}
                        </span>
                    </div>

                    <TrackAttributePills
                        track={selectedTrack}
                        onFilter={onFilter}
                        className="track-spotlight-tags mt-2 flex flex-wrap gap-1"
                    />

                    <div className="mt-3 flex items-center gap-3">
                        <TrackPlayButton
                            track={selectedTrack}
                            playlist={tracks}
                            size="md"
                        />
                        <FavoriteButton
                            track={selectedTrack}
                            showLikes
                            className="h-8 min-w-8"
                            classNames={{ svg: 'size-5' }}
                        />
                        <TrackOptionsDropdown
                            key={getTrackKey(selectedTrack, 0)}
                            track={selectedTrack}
                            creator={selectedCreator}
                            onOpenChange={setIsOptionsOpen}
                        />
                    </div>
                </div>
            </article>

            <div className="flex min-w-0 flex-col gap-1">
                {tracks.map((track, index) => {
                    const trackKey = getTrackKey(track, index)
                    const isSelected = track.id === selectedTrack.id
                    const creator = getCreatorForTrack(creatorsById, track)
                    const creatorName = getCreatorDisplayName(
                        creatorsById,
                        track
                    )
                    const isCurrent =
                        currentTrack?.id != null &&
                        String(currentTrack.id) === String(track.id)

                    return (
                        <button
                            key={trackKey}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => {
                                setSelectedTrackKey(trackKey)
                                setIsOptionsOpen(false)
                            }}
                            className={`track-spotlight-row grid min-h-14 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border px-2 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                                isSelected ? 'is-selected' : ''
                            } ${isCurrent ? 'is-current' : ''}`}
                            style={{ animationDelay: `${index * 45}ms` }}
                        >
                            <TrackVisual
                                track={track}
                                creator={creator}
                                animateAvatar={
                                    isSelected && shouldAnimateAvatar
                                }
                                className="size-10"
                                avatarClassName="size-3/4"
                                sizes="40px"
                            />

                            <span className="min-w-0">
                                <span className="track-spotlight-title block truncate text-sm font-bold text-foreground">
                                    {track.name || 'Unknown track'}
                                </span>
                                <span className="block truncate text-xs text-muted-foreground">
                                    {creatorName || 'Unknown creator'}
                                </span>
                            </span>

                            <span className="text-xs text-muted-foreground">
                                {formatDuration(track.length)}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default memo(TrackSpotlightView)
