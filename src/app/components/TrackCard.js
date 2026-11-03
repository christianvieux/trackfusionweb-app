import { memo } from 'react'
import Link from 'next/link'

import TrackVisual from './TrackList/components/TrackVisual'
import { getTrackAttributeSummary } from './TrackList/utils'

function TrackCard({
    track = {},
    creator,
    animateAvatar = false,
    showAttributes = false,
    subtitle,
    mediumSubtitle,
    compactSubtitle,
    titleHref,
    className = '',
    rightContent,
    ...props
}) {
    const attributeSummary = showAttributes
        ? getTrackAttributeSummary(track)
        : ''
    const defaultSubtitle = [track.artist || 'Unknown Artist', attributeSummary]
        .filter(Boolean)
        .join(' · ')

    return (
        <div
            id="track-card"
            className={`relative z-0 flex min-w-0 items-center gap-2 ${className}`}
            {...props}
        >
            <div
                id="left_content"
                className="flex min-w-0 flex-1 items-center gap-2"
            >
                <TrackVisual
                    track={track}
                    creator={creator}
                    animateAvatar={animateAvatar}
                    className="size-10"
                    avatarClassName="size-3/4"
                    sizes="40px"
                />

                <div className="max-w-full min-w-0 flex-1 overflow-hidden">
                    <p className="w-max max-w-full truncate text-left text-base font-bold text-foreground">
                        {titleHref ? (
                            <Link
                                href={titleHref}
                                className="transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                title={track.name || 'Unknown Track'}
                            >
                                {track.name || 'Unknown Track'}
                            </Link>
                        ) : (
                            track.name || 'Unknown Track'
                        )}
                    </p>

                    <p
                        className="track-card-subtitle truncate text-left text-xs text-muted-foreground"
                        title={subtitle || defaultSubtitle}
                    >
                        {subtitle || defaultSubtitle}
                    </p>

                    {compactSubtitle && (
                        <p
                            className="track-card-compact-subtitle hidden truncate text-left text-xs text-muted-foreground"
                            title={compactSubtitle}
                        >
                            {compactSubtitle}
                        </p>
                    )}

                    {mediumSubtitle && (
                        <p
                            className="track-card-medium-subtitle hidden truncate text-left text-xs text-muted-foreground"
                            title={mediumSubtitle}
                        >
                            {mediumSubtitle}
                        </p>
                    )}
                </div>
            </div>

            {rightContent && (
                <div
                    id="right_content"
                    className="flex items-center justify-center"
                >
                    {rightContent}
                </div>
            )}
        </div>
    )
}

TrackCard.displayName = 'TrackCard'

export default memo(TrackCard)
