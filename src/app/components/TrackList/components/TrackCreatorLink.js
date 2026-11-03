'use client'

import { useState } from 'react'
import Link from 'next/link'

import BlobAvatarDisplay from '../../BlobAvatarDisplay'

export default function TrackCreatorLink({
    creator,
    userId,
    animate = false,
    showAvatar = true,
    className = '',
    avatarClassName = 'size-5',
    nameClassName = '',
}) {
    const [isInteracting, setIsInteracting] = useState(false)
    const username = creator?.username || 'Unknown creator'
    const profilePath = userId ? `/profile/${userId}` : '#'

    return (
        <Link
            href={profilePath}
            aria-label={`View ${username}'s profile`}
            className={`flex min-w-0 items-center gap-2 text-primary transition-colors hover:text-primary-hover ${className}`}
            onPointerEnter={() => setIsInteracting(true)}
            onPointerLeave={() => setIsInteracting(false)}
            onFocus={() => setIsInteracting(true)}
            onBlur={() => setIsInteracting(false)}
        >
            {showAvatar && (
                <BlobAvatarDisplay
                    avatar={creator?.avatar}
                    userId={userId}
                    animate={animate || isInteracting}
                    className={avatarClassName}
                    label={`${username} avatar`}
                />
            )}

            <span className={`truncate ${nameClassName}`}>{username}</span>
        </Link>
    )
}
