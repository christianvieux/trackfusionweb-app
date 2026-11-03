import UserAvatar from './UserAvatar'

export default function UserPill({
    userInfo,
    userId,
    username = 'New User',
    isGuest = false,
    isLoading = false,
    animate = false,
    className = '',
    classNames = {},
}) {
    return (
        <div
            className={`flex w-max items-center gap-2 rounded-full pr-2 text-success transition hover:bg-secondary-hover ${className}`}
        >
            <UserAvatar
                userInfo={userInfo}
                userId={userId}
                username={username}
                isGuest={isGuest}
                isLoading={isLoading}
                animate={animate}
                className={classNames.UserAvatar}
            />

            <span
                className={`max-w-32 truncate text-lg font-semibold ${classNames.Username}`}
            >
                {username}
            </span>
        </div>
    )
}
