'use client'

import { Avatar } from '@heroui/react'

import BlobAvatarDisplay from './BlobAvatarDisplay'

const FALLBACK_AVATAR = '/images/pfp-pic.jpg'

export default function AvatarComponent({
    avatar,
    userId,
    src,
    isGuest = false,
    isLoading = false,
    animate = false,
    alt = 'User avatar',
    fallback = 'U',
    className = '',
    ...props
}) {
    // Retained for the benched image-upload form so that restoring that feature
    // later does not require rebuilding its preview behavior.
    if (!avatar && !userId && !isGuest) {
        return (
            <Avatar className={className} {...props}>
                <Avatar.Image alt={alt} src={src || FALLBACK_AVATAR} />
                <Avatar.Fallback>{fallback}</Avatar.Fallback>
            </Avatar>
        )
    }

    return (
        <BlobAvatarDisplay
            avatar={avatar}
            userId={userId}
            isGuest={isGuest}
            isLoading={isLoading}
            animate={animate}
            label={alt}
            className={className}
        />
    )
}
