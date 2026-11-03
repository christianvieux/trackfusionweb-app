import { Button, Card, Separator } from '@heroui/react'

import BlobAvatarDisplay from '../../BlobAvatarDisplay'
import { formatJoinDate } from '../utils'

export default function ProfileHeader({
    user,
    trackCount = 0,
    favoriteCount = 0,
    onShare,
}) {
    const username = user?.username || 'Unknown'

    return (
        <Card className="h-auto min-h-fit w-full overflow-visible border-2 border-accent bg-secondary px-5 py-5 text-foreground shadow-card sm:px-8 md:px-10">
            {/* Mobile layout */}
            <div className="md:hidden">
                <div className="mb-5 flex items-center gap-4">
                    <BlobAvatarDisplay
                        userId={user?.id}
                        avatar={user?.avatar}
                        label={`${username} avatar`}
                        className="size-16"
                        animate
                    />

                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-bold text-foreground">
                            {username}
                        </h1>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Joined {formatJoinDate(user?.created_at)}
                        </p>
                    </div>
                </div>

                <div className="mb-4 flex rounded-xl border border-muted-foreground bg-muted">
                    <ProfileStat label="Tracks" value={trackCount} />
                    <Separator
                        className="my-auto h-10 bg-muted-foreground"
                        orientation="vertical"
                    />
                    <ProfileStat label="Favorites" value={favoriteCount} />
                </div>

                <Separator className="bg-muted-foreground" />

                <div className="mt-4 flex justify-center">
                    <Button
                        size="sm"
                        variant="bordered"
                        className="text-lg text-foreground hover:bg-secondary-hover"
                        onPress={onShare}
                    >
                        Share Profile
                    </Button>
                </div>
            </div>
            {/* Desktop layout */}
            <div className="hidden items-center gap-8 md:flex">
                <BlobAvatarDisplay
                    userId={user?.id}
                    avatar={user?.avatar}
                    label={`${username} avatar`}
                    className="size-28 lg:size-32"
                    animate
                />

                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-4xl font-bold text-foreground">
                        {username}
                    </h1>

                    <p className="text-md mt-2 text-muted-foreground sm:text-lg">
                        Joined {formatJoinDate(user?.created_at)}
                    </p>

                    <Button
                        size="sm"
                        variant="bordered"
                        className="mt-4 border-primary text-foreground hover:bg-secondary-hover"
                        onPress={onShare}
                    >
                        Share Profile
                    </Button>
                </div>

                <div className="flex min-w-56 rounded-xl border border-muted-foreground bg-muted">
                    <ProfileStat label="Tracks" value={trackCount} />
                    <Separator
                        className="my-auto h-12 bg-muted-foreground"
                        orientation="vertical"
                    />
                    <ProfileStat label="Favorites" value={favoriteCount} />
                </div>
            </div>
        </Card>
    )
}

function ProfileStat({ label, value }) {
    return (
        <div className="flex flex-1 flex-col items-center py-3">
            <span className="text-xl font-bold text-foreground">{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
        </div>
    )
}
