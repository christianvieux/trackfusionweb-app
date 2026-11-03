import Link from 'next/link'

import FavoriteButton from '../../FavoriteButton'
import PlayPauseButton from '../../PlayPause_Button'
import TrackOptionsDropdown from '../../TrackOptionsDropdown'
import TrackVisual from '../../TrackList/components/TrackVisual'

export default function TrackCoverCard({ track, creator, onFavoritesChanged }) {
    const creatorProfileUrl = creator?.id ? `/profile/${creator.id}` : '#'

    return (
        <section id="Track_Card" className="flex min-w-0 flex-col gap-3">
            <div className="relative mx-auto aspect-square w-full max-w-80">
                <TrackVisual
                    track={track}
                    creator={creator}
                    animateAvatar
                    avatarAura
                    className="size-full rounded-xl"
                    avatarClassName="size-1/2"
                    sizes="(max-width: 768px) calc(100vw - 48px), 320px"
                />

                <div className="absolute bottom-3 left-3 z-20 flex rounded-full bg-black/65 backdrop-blur-sm">
                    <PlayPauseButton
                        track={track}
                        size="lg"
                    />
                </div>

                <div className="absolute right-3 bottom-3 z-20 rounded-lg bg-black/65 backdrop-blur-sm">
                    <FavoriteButton
                        className="size-10 min-w-10 justify-center rounded-lg p-1 text-success-hover"
                        classNames={{
                            svg: 'size-6',
                        }}
                        track={track}
                        onFavoritesChanged={onFavoritesChanged}
                    />
                </div>

            </div>

            <div className="rounded-xl border border-success/15 bg-black/15 p-3">
                <div className="flex min-w-0 items-center justify-between gap-3">
                    <div id="Creator" className="flex min-w-0 items-center gap-1.5">
                        <span className="shrink-0 text-xs text-muted-foreground">By</span>
                        <Link
                            href={creatorProfileUrl}
                            className="truncate text-sm font-semibold text-success-hover transition-colors hover:text-foreground"
                        >
                            {creator?.username || 'Unknown creator'}
                        </Link>
                    </div>

                    <TrackOptionsDropdown track={track} creator={creator} />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>
                        {track.favorites_count || 0}{' '}
                        {(track.favorites_count || 0) === 1 ? 'favorite' : 'favorites'}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                        <span
                            className={`size-2 rounded-full ${
                                track.is_private ? 'bg-danger' : 'bg-success'
                            }`}
                            aria-hidden="true"
                        />
                        {track.is_private ? 'Private' : 'Public'}
                    </span>
                </div>
            </div>
        </section>
    )
}
