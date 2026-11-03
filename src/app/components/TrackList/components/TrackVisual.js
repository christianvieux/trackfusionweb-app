'use client'

import { memo, useEffect, useMemo, useState } from 'react'

import BlobAvatarDisplay from '../../BlobAvatarDisplay'
import TrackArtwork from '../../TrackArtwork'
import { getTrackVisualPalette } from '../utils'

function hasArtwork(track) {
    return typeof track?.image_url === 'string' && track.image_url.trim() !== ''
}

function TrackVisual({
    track,
    creator,
    animateAvatar = false,
    className = 'size-10',
    avatarClassName = 'size-2/3',
    imageClassName = 'object-cover',
    sizes = '40px',
    background: backgroundOverride,
    avatarAura = false,
    alwaysShowAvatar = false,
}) {
    const artworkUrl = hasArtwork(track) ? track.image_url : null
    const [artworkFailed, setArtworkFailed] = useState(false)

    useEffect(() => {
        setArtworkFailed(false)
    }, [artworkUrl])

    const showArtwork = Boolean(artworkUrl) && !artworkFailed
    const creatorName = creator?.username || 'Creator'
    const background = useMemo(() => {
        if (backgroundOverride) return backgroundOverride

        const palette = getTrackVisualPalette(track)
        return `linear-gradient(135deg, ${palette.from} 0%, ${palette.via} 52%, ${palette.to} 100%)`
    }, [backgroundOverride, track])
    const avatarColor = creator?.avatar?.color || '#22c55e'

    return (
        <div
            className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10 ring-inset ${className}`}
            style={{ background }}
        >
            {showArtwork ? (
                <TrackArtwork
                    src={artworkUrl}
                    alt={track?.name ? `${track.name} cover` : 'Track cover'}
                    fill
                    sizes={sizes}
                    className={imageClassName}
                    onError={() => setArtworkFailed(true)}
                />
            ) : null}

            {(!showArtwork || alwaysShowAvatar) && avatarAura && (
                <span
                    aria-hidden="true"
                    className="absolute inset-[22%] z-[1] rounded-full opacity-60 blur-[34px]"
                    style={{ backgroundColor: avatarColor }}
                />
            )}

            {(!showArtwork || alwaysShowAvatar) && (
                <BlobAvatarDisplay
                    avatar={creator?.avatar}
                    userId={track?.creator_id}
                    animate={animateAvatar}
                    className={`relative z-[2] drop-shadow-[0_8px_20px_rgba(0,0,0,.28)] ${avatarClassName}`}
                    label={`${creatorName} avatar`}
                />
            )}
        </div>
    )
}

export default memo(TrackVisual)
