'use client'

import { ChevronsUp, List, SkipBack, SkipForward } from 'lucide-react'

import FavoriteButton from '../FavoriteButton'
import PlayButton from '../PlayButton'
import TrackOptionsDropdown from '../TrackOptionsDropdown'
import TrackVisual from '../TrackList/components/TrackVisual'

import VolumeSlider from './Volume'
import ProgressSlider from './ProgressSlider'

function QueueBadge({ count }) {
    if (!count) return null

    return (
        <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-success px-1 text-[10px] font-bold text-success-foreground">
            {count > 99 ? '99+' : count}
        </span>
    )
}

function TransportButton({ label, onClick, children }) {
    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className="collapsed-player-icon-button"
        >
            {children}
        </button>
    )
}

export default function CollapsedPlayer({
    track,
    creator,
    isPlaying,
    progress,
    duration,
    volume,
    queueCount,
    isBusy,
    onSeek,
    onVolumeChange,
    onPlayPause,
    onPrevious,
    onNext,
    onOpenQueue,
    onExpand,
    canControlVolume = true,
}) {
    return (
        <aside className="collapsed-player" aria-label="Collapsed player">
            <button
                type="button"
                aria-label="Expand player"
                title="Expand player"
                onClick={onExpand}
                className="player-edge-toggle collapsed-player-expand"
            >
                <ChevronsUp className="size-4" />
            </button>

            <div className="collapsed-player-track">
                <TrackVisual
                    track={track}
                    creator={creator}
                    animateAvatar={isPlaying}
                    className="collapsed-player-art size-10 rounded-lg"
                    avatarClassName="size-2/3"
                    sizes="40px"
                />

                <div className="collapsed-player-meta min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                        {track.name || 'Unknown track'}
                    </p>
                    <p className="truncate text-xs text-[#a7f3d0]/70">
                        {creator?.username || track.artist || 'Unknown creator'}
                    </p>
                </div>
            </div>

            <ProgressSlider
                progress={progress}
                duration={duration}
                onSeek={onSeek}
                className="collapsed-player-progress"
            />

            <div className="collapsed-player-transport">
                <TransportButton label="Previous track" onClick={onPrevious}>
                    <SkipBack className="size-4" />
                </TransportButton>
                <PlayButton
                    playing={isPlaying}
                    progress={progress}
                    size="md"
                    onClick={onPlayPause}
                    label={track.name || 'track'}
                    aria-busy={isBusy}
                />
                <TransportButton label="Next track" onClick={onNext}>
                    <SkipForward className="size-4" />
                </TransportButton>
            </div>

            <div className="collapsed-player-actions">
                {canControlVolume && (
                    <VolumeSlider
                        className="collapsed-player-volume"
                        defaultValue={volume}
                        onChange={onVolumeChange}
                    />
                )}

                <FavoriteButton
                    track={track}
                    className="collapsed-player-secondary-action"
                    classNames={{ svg: 'size-[18px]' }}
                />
                <TrackOptionsDropdown
                    track={track}
                    creator={creator}
                    className="collapsed-player-secondary-action"
                    triggerClassName="size-9 rounded-lg text-[var(--stage-accent-light)] hover:bg-[rgb(52_211_153_/_0.1)]"
                />
                <button
                    type="button"
                    aria-label="Open playback queue"
                    onClick={onOpenQueue}
                    className="collapsed-player-icon-button relative"
                >
                    <List className="size-5" />
                    <QueueBadge count={queueCount} />
                </button>
            </div>
        </aside>
    )
}
