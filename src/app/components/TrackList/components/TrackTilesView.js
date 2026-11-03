'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTrackManager } from '../../../context/TrackManagerContext'

import FavoriteButton from '../../FavoriteButton'
import TrackOptionsDropdown from '../../TrackOptionsDropdown'
import TrackPlayButton from '../../TrackPlayButton'
import { formatDuration } from '../../../utils/audio'
import {
    getCreatorForTrack,
    getTrackAttributeSummary,
    getTrackKey,
} from '../utils'

import TrackCreatorLink from './TrackCreatorLink'
import TrackListEmptyState from './TrackListEmptyState'
import TrackVisual from './TrackVisual'

function TrackTile({ track, creator, playlist }) {
    const { currentTrack } = useTrackManager()
    const [isInteracting, setIsInteracting] = useState(false)
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)
    const shouldAnimateAvatar = isInteracting || isOptionsOpen
    const attributeSummary = getTrackAttributeSummary(track)
    const isCurrentTrack =
        currentTrack?.id != null &&
        String(currentTrack.id) === String(track.id)

    return (
        <article
            aria-current={isCurrentTrack ? 'true' : undefined}
            className={`group flex min-w-0 flex-col rounded-[14px] border p-2 transition focus-within:border-success/70 hover:border-success/70 ${
                isCurrentTrack
                    ? 'border-success/40 bg-success/10'
                    : 'border-success/20 bg-white/[.035]'
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
            <div className="relative">
                <TrackVisual
                    track={track}
                    creator={creator}
                    animateAvatar={shouldAnimateAvatar}
                    className="aspect-square w-full rounded-[10px]"
                    avatarClassName="size-[64%]"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 220px"
                />

                <span className="absolute right-1.5 bottom-1.5 flex rounded-full bg-[#050510]/70">
                    <TrackPlayButton
                        track={track}
                        playlist={playlist}
                        size="sm"
                    />
                </span>

                {track.is_private && (
                    <span className="absolute top-2 left-2 rounded-md bg-background/85 px-2 py-1 text-[10px] font-medium text-foreground">
                        Private
                    </span>
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col px-0.5 pt-2.5">
                <Link
                    href={`/track/${track.id}`}
                    className="truncate text-sm font-bold text-foreground transition-colors hover:text-primary"
                    title={track.name || 'Unknown track'}
                >
                    {track.name || 'Unknown track'}
                </Link>

                <TrackCreatorLink
                    creator={creator}
                    userId={track.creator_id}
                    animate={shouldAnimateAvatar}
                    className="mt-1 max-w-full"
                    avatarClassName="size-4"
                    nameClassName="text-xs font-semibold"
                />

                {attributeSummary && (
                    <p
                        className="mt-1 truncate text-[11px] text-muted-foreground"
                        title={attributeSummary}
                    >
                        {attributeSummary}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-xs text-muted-foreground">
                    <span>{formatDuration(track.length)}</span>

                    <div className="flex items-center gap-2">
                        <FavoriteButton
                            track={track}
                            showLikes
                            className="h-6 min-w-6"
                            classNames={{ svg: 'size-4' }}
                        />
                        <TrackOptionsDropdown
                            track={track}
                            creator={creator}
                            onOpenChange={setIsOptionsOpen}
                        />
                    </div>
                </div>
            </div>
        </article>
    )
}

export default function TrackTilesView({ tracks, creatorsById, emptyMessage }) {
    if (tracks.length === 0) {
        return <TrackListEmptyState message={emptyMessage} />
    }

    return (
        <div
            aria-label="Tracks in tiles"
            className="track-tile-grid"
        >
            {tracks.map((track, index) => (
                <TrackTile
                    key={getTrackKey(track, index)}
                    track={track}
                    creator={getCreatorForTrack(creatorsById, track)}
                    playlist={tracks}
                />
            ))}
        </div>
    )
}
