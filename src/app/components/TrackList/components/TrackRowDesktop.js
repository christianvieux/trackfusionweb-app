'use client'

import { useState } from 'react'

import TrackCard from '../../TrackCard'
import FavoriteButton from '../../FavoriteButton'
import TrackOptionsDropdown from '../../TrackOptionsDropdown'
import TrackPlayButton from '../../TrackPlayButton'

import { formatDuration } from '../../../utils/audio'
import { useTrackManager } from '../../../context/TrackManagerContext'

import TrackCreatorLink from './TrackCreatorLink'
import TrackAttributePills from './TrackAttributePills'
import {
    getCreatorDisplayName,
    parseAttributes,
} from '../utils'

export default function TrackRowDesktop({
    track,
    paginatedTracks,
    creator,
    onFilter,
    className = '',
    ...props
}) {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false)

    const { currentTrack } = useTrackManager()
    const isCurrentTrack =
        currentTrack?.id != null &&
        String(currentTrack.id) === String(track.id)
    const creatorName = getCreatorDisplayName(
        { [track.creator_id]: creator },
        track
    )
    const compactSubtitle = [
        creatorName,
        parseAttributes(track.genre)[0],
        formatDuration(track.length),
    ]
        .filter(Boolean)
        .join(' · ')
    const genre = parseAttributes(track.genre)[0]
    const mediumSubtitle = ['TrackFusionWeb', genre]
        .filter(Boolean)
        .join(' · ')

    return (
        <article
            role="row"
            aria-current={isCurrentTrack ? 'true' : undefined}
            className={`track-row-grid track-row-item ${isCurrentTrack ? 'is-current' : ''} ${className}`}
            {...props}
        >
            <div className="track-row-play flex items-center justify-center">
                <TrackPlayButton
                    track={track}
                    playlist={paginatedTracks}
                    size="sm"
                />
            </div>

            <div className="track-row-title flex min-w-0 items-center gap-2">
                <TrackCard
                    className="w-full"
                    track={track}
                    creator={creator}
                    titleHref={`/track/${track.id}`}
                    animateAvatar={isOptionsOpen}
                    subtitle="TrackFusionWeb"
                    mediumSubtitle={mediumSubtitle}
                    compactSubtitle={compactSubtitle}
                />

                {track.is_private && (
                    <span
                        className="shrink-0 rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground"
                        title="Private track"
                    >
                        🔒
                    </span>
                )}
            </div>

            <TrackAttributePills
                track={track}
                onFilter={onFilter}
                preserveSpace
                className="track-row-tags min-w-0 items-center gap-1 overflow-hidden"
            />

            <div className="track-row-creator min-w-0">
                <TrackCreatorLink
                    creator={creator}
                    userId={track.creator_id}
                    animate={isOptionsOpen}
                    className="max-w-full"
                    nameClassName="text-sm font-semibold"
                />
            </div>

            <span className="track-row-time text-sm text-muted-foreground">
                {formatDuration(track.length)}
            </span>

            <div className="track-row-like flex items-center justify-center">
                <FavoriteButton
                    track={track}
                    classNames={{ svg: 'h-5 w-5' }}
                />
            </div>

            <div className="track-row-more flex items-center justify-center">
                <TrackOptionsDropdown
                    track={track}
                    creator={creator}
                    onOpenChange={setIsOptionsOpen}
                />
            </div>
        </article>
    )
}
