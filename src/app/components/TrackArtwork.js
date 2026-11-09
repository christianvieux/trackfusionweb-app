'use client'

import Image from 'next/image'
import { memo, useState } from 'react'

import {
    getTrackArtworkSource,
    isPresignedArtworkUrl,
} from './trackArtworkUtils'

export const DEFAULT_TRACK_ARTWORK = '/images/6068474.jpg'

function TrackArtwork({
    src,
    fallbackSrc = DEFAULT_TRACK_ARTWORK,
    alt = 'Track cover',
    onError,
    ...imageProps
}) {
    const requestedSrc = src || fallbackSrc
    const [failedSrc, setFailedSrc] = useState(null)
    const activeSrc = getTrackArtworkSource(src, fallbackSrc, failedSrc)

    function handleError(event) {
        onError?.(event)
        if (activeSrc !== fallbackSrc) setFailedSrc(requestedSrc)
    }

    return (
        <Image
            {...imageProps}
            src={activeSrc}
            alt={alt}
            unoptimized={isPresignedArtworkUrl(activeSrc)}
            onError={handleError}
        />
    )
}

export default memo(TrackArtwork)
