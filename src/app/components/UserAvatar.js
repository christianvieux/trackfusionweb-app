import BlobAvatarDisplay from './BlobAvatarDisplay'

export default function UserAvatar({
    userInfo,
    userId,
    username = 'New User',
    isGuest = false,
    isLoading = false,
    animate = false,
    className = 'size-9',
}) {
    return (
        <BlobAvatarDisplay
            avatar={userInfo?.avatar}
            userId={userInfo?.id || userId}
            isGuest={isGuest}
            isLoading={isLoading}
            animate={animate}
            label={`${username}'s avatar`}
            className={className}
        />
    )
}
