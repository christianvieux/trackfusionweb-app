'use client'

import { memo, useMemo } from 'react'
import { BlobAvatar } from 'blob-avatar'

import { resolveUserAvatar } from '../avatar/avatarUtils'

function BlobAvatarDisplay({
    avatar,
    userId,
    isGuest = false,
    isLoading = false,
    animate = false,
    className = 'size-9',
    label = 'User avatar',
}) {
    const config = useMemo(
        () =>
            isLoading ? null : resolveUserAvatar({ userId, avatar, isGuest }),
        [avatar, isGuest, isLoading, userId]
    )

    if (!config) {
        return (
            <span
                role="status"
                aria-label="Loading avatar"
                className={`inline-block animate-pulse rounded-full bg-muted ${className}`}
            />
        )
    }

    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center ${className}`}
        >
            <BlobAvatar
                {...config}
                size="100%"
                animation="idle.2.4,wink.1.6"
                paused={!animate}
                aria-label={label}
            />
        </span>
    )
}

export default memo(BlobAvatarDisplay)
