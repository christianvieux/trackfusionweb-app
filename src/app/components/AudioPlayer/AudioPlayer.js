'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Slider } from '@heroui/react'
import {
    ChevronDown,
    List,
    ChevronsDown,
    Repeat,
    Shuffle,
    SkipBack,
    SkipForward,
} from 'lucide-react'

import FavoriteButton from '../FavoriteButton'
import PlayButton from '../PlayButton'
import TrackListQueue from '../TrackListQueue/TrackListQueue'
import TrackOptionsDropdown from '../TrackOptionsDropdown'
import TrackCreatorLink from '../TrackList/components/TrackCreatorLink'
import TrackVisual from '../TrackList/components/TrackVisual'
import useTrackCreators from '../TrackList/hooks/useTrackCreators'
import {
    getCreatorForTrack,
    getStageVisualBackground,
} from '../TrackList/utils'
import VolumeSlider from './Volume'
import AudioElement from './AudioElement'
import CollapsedPlayer from './CollapsedPlayer'

import { usePlayback } from '../../context/PlaybackContext'
import { useTrackManager } from '../../context/TrackManagerContext'
import { fetchAuthorizedUrl } from '../../services/trackService'
import { formatDuration } from '../../utils/audio'

const QUEUE_STORAGE_KEY = 'trackfusionweb-stage-queue-open'

function getTrackIdentity(track) {
    return track?.uniqueId || `track-${track?.id}`
}

function ControlButton({
    label,
    onClick,
    active = false,
    disabled = false,
    children,
}) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-pressed={active || undefined}
            onClick={onClick}
            disabled={disabled}
            className={`stage-control-button ${active ? 'is-active' : ''}`}
        >
            {children}
        </button>
    )
}

function StageArtwork({ track, creator, compact = false, animate = false }) {
    return (
        <TrackVisual
            key={getTrackIdentity(track)}
            track={track}
            creator={creator}
            animateAvatar={animate}
            background={getStageVisualBackground(track)}
            avatarAura
            className={
                compact
                    ? 'size-[72px] rounded-xl'
                    : 'stage-cover aspect-square w-full rounded-2xl'
            }
            avatarClassName="size-1/2"
            sizes={compact ? '72px' : '330px'}
        />
    )
}

function QueueBadge({ count }) {
    if (!count) return null

    return (
        <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-success px-1 text-[10px] font-bold text-success-foreground">
            {count > 99 ? '99+' : count}
        </span>
    )
}

export default function AudioPlayer({
    isCollapsed = false,
    onCollapsedChange = () => {},
}) {
    const {
        shufflePlaylist,
        resetPlaylist,
        playNextTrack,
        playPreviousTrack,
        playlist,
        queue,
        currentTrack,
        isPlaying,
        audioRef,
        resumeTrack: resumeTrackInManager,
        pauseTrack: pauseTrackInManager,
        setIsTrackReadyInPlayer,
    } = useTrackManager()
    const { canShowPlayback } = usePlayback()

    const [audioSrc, setAudioSrc] = useState(null)
    const [currentTrackInPlayer, setCurrentTrackInPlayer] = useState(null)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [sliderValue, setSliderValue] = useState(0)
    const [volumeValue, setVolumeValue] = useState(0.8)
    const [isSliderDragging, setIsSliderDragging] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)
    const [isBuffering, setIsBuffering] = useState(false)
    const [isMetadataLoaded, setIsMetadataLoaded] = useState(false)
    const [isFetchingTrack, setIsFetchingTrack] = useState(false)
    const [isTrackReady, setIsTrackReady] = useState(false)
    const [isQueueOpen, setIsQueueOpen] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const upcomingPlaylistTracks = useMemo(() => {
        if (!currentTrack) return playlist

        const currentIndex = playlist.findIndex(
            (track) =>
                getTrackIdentity(track) === getTrackIdentity(currentTrack)
        )

        return currentIndex === -1 ? playlist : playlist.slice(currentIndex + 1)
    }, [currentTrack, playlist])

    const upcomingTracks = useMemo(
        () => [...queue, ...upcomingPlaylistTracks],
        [queue, upcomingPlaylistTracks]
    )
    const playerTracks = useMemo(
        () =>
            currentTrack ? [currentTrack, ...upcomingTracks] : upcomingTracks,
        [currentTrack, upcomingTracks]
    )
    const creatorsById = useTrackCreators(playerTracks)
    const currentCreator = getCreatorForTrack(creatorsById, currentTrack)
    const hasTrackEnded = isMetadataLoaded && currentTime >= duration

    const resetPlayback = useCallback(() => {
        setCurrentTrackInPlayer(null)
        setAudioSrc(null)
        setIsMetadataLoaded(false)
        setIsTrackReady(false)
        setSliderValue(0)
        setCurrentTime(0)
        setDuration(0)
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
    }, [audioRef])

    const loadTrack = useCallback(
        async (track) => {
            resetPlayback()
            if (!track?.id) return

            try {
                setCurrentTrackInPlayer(track)
                setIsFetchingTrack(true)
                const { url } = await fetchAuthorizedUrl(track.id)
                setAudioSrc(url)
            } catch (error) {
                console.error('Failed to fetch authorized URL:', error)
                setAudioSrc(null)
            } finally {
                setIsFetchingTrack(false)
            }
        },
        [resetPlayback]
    )

    const handlePlay = useCallback(() => {
        if (!audioSrc && currentTrack && !isFetchingTrack) {
            loadTrack(currentTrack)
        }
        resumeTrackInManager()
    }, [
        audioSrc,
        currentTrack,
        isFetchingTrack,
        loadTrack,
        resumeTrackInManager,
    ])
    const handlePause = useCallback(
        () => pauseTrackInManager(),
        [pauseTrackInManager]
    )
    const handlePlayPause = useCallback(() => {
        isPlaying ? handlePause() : handlePlay()
    }, [handlePause, handlePlay, isPlaying])
    const handleSkip = useCallback(() => {
        playNextTrack()
    }, [playNextTrack])
    const handlePrevious = useCallback(() => {
        playPreviousTrack()
    }, [playPreviousTrack])

    function handleSliderChange(value) {
        setSliderValue(value)
        setIsSliderDragging(true)
    }

    function handleSliderChangeEnd(value) {
        if (!audioRef.current || !duration) return
        audioRef.current.currentTime = value * duration
        setIsSliderDragging(false)
    }

    function handleMetadataLoaded(event) {
        setDuration(event.currentTarget.duration)
        setIsMetadataLoaded(true)
    }

    function handleTimeUpdate(event) {
        const { currentTime: nextTime, duration: nextDuration } =
            event.currentTarget
        setCurrentTime(nextTime)
        if (!isSliderDragging) {
            setSliderValue(nextDuration > 0 ? nextTime / nextDuration : 0)
        }
    }

    function toggleShuffle() {
        const nextValue = !isShuffling
        setIsShuffling(nextValue)
        nextValue ? shufflePlaylist() : resetPlaylist()
    }

    useEffect(() => {
        setIsQueueOpen(localStorage.getItem(QUEUE_STORAGE_KEY) === 'true')
    }, [])

    useEffect(() => {
        localStorage.setItem(QUEUE_STORAGE_KEY, String(isQueueOpen))
    }, [isQueueOpen])

    useEffect(() => {
        if (!isSheetOpen) return undefined

        function closeOnEscape(event) {
            if (event.key === 'Escape') setIsSheetOpen(false)
        }

        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [isSheetOpen])

    useEffect(() => {
        canShowPlayback && currentTrack
            ? loadTrack(currentTrack)
            : resetPlayback()
    }, [canShowPlayback, currentTrack, loadTrack, resetPlayback])

    useEffect(() => {
        const ready =
            canShowPlayback &&
            isMetadataLoaded &&
            !isBuffering &&
            !isFetchingTrack &&
            Boolean(audioSrc)
        setIsTrackReady(ready)
        setIsTrackReadyInPlayer(ready)
    }, [
        audioSrc,
        canShowPlayback,
        isBuffering,
        isFetchingTrack,
        isMetadataLoaded,
        setIsTrackReadyInPlayer,
    ])

    useEffect(() => {
        if (!isTrackReady || currentTrackInPlayer !== currentTrack) return
        if (!isPlaying) {
            audioRef.current?.pause()
            return
        }
        if (hasTrackEnded && !isLooping) {
            handleSkip()
            return
        }
        audioRef.current?.play().catch(console.error)
    }, [
        audioRef,
        currentTrack,
        currentTrackInPlayer,
        handleSkip,
        hasTrackEnded,
        isLooping,
        isPlaying,
        isTrackReady,
    ])

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volumeValue
    }, [audioRef, volumeValue])

    useEffect(() => {
        if (!('mediaSession' in navigator)) return undefined
        const actions = {
            play: handlePlay,
            pause: handlePause,
            nexttrack: handleSkip,
            previoustrack: handlePrevious,
        }
        Object.entries(actions).forEach(([action, handler]) =>
            navigator.mediaSession.setActionHandler(action, handler)
        )
        return () =>
            Object.keys(actions).forEach((action) =>
                navigator.mediaSession.setActionHandler(action, null)
            )
    }, [handlePause, handlePlay, handlePrevious, handleSkip])

    if (!canShowPlayback || !currentTrack) return null

    function renderMeta() {
        return (
            <div className="stage-meta-panel flex min-w-0 flex-1 items-center gap-2">
                <div className="min-w-0 flex-1">
                    <p
                        className="truncate text-[.95rem] font-bold leading-tight text-foreground"
                        title={currentTrack.name || 'Unknown track'}
                    >
                        {currentTrack.name || 'Unknown track'}
                    </p>
                    <TrackCreatorLink
                        creator={currentCreator}
                        userId={currentTrack.creator_id}
                        animate={isPlaying}
                        className="mt-1 max-w-full gap-1.5 !text-[#a7f3d0] hover:!text-[#d1fae5]"
                        avatarClassName="size-[18px]"
                        nameClassName="text-[.78rem] font-semibold"
                    />
                </div>

                <div className="stage-meta-actions flex shrink-0 items-center">
                    <FavoriteButton
                        track={currentTrack}
                        className="size-8 min-w-8 !text-[#a7f3d0]"
                        classNames={{ svg: 'size-4' }}
                    />
                    <TrackOptionsDropdown
                        track={currentTrack}
                        creator={currentCreator}
                        className="size-8"
                        triggerClassName="size-8 rounded-lg !text-[#a7f3d0] hover:bg-[rgb(52_211_153_/_0.1)]"
                    />
                </div>
            </div>
        )
    }

    function renderQueue() {
        return (
            <TrackListQueue
                variant="stage"
                onClear={() => setIsShuffling(false)}
            />
        )
    }

    function renderStageContent({
        showClose = false,
        showCollapse = false,
    } = {}) {
        return (
            <div
                className={`stage-player-content ${isQueueOpen ? 'is-queue-open' : ''} ${showCollapse ? 'has-collapse-control' : ''}`}
            >
                {showClose && (
                    <button
                        type="button"
                        aria-label="Close player"
                        onClick={() => setIsSheetOpen(false)}
                        className="stage-sheet-close"
                    >
                        <ChevronDown className="size-6" />
                    </button>
                )}

                {showCollapse && (
                    <button
                        type="button"
                        aria-label="Collapse player to the bottom"
                        title="Collapse player to the bottom"
                        onClick={() => onCollapsedChange(true)}
                        className="player-edge-toggle stage-collapse-toggle"
                    >
                        <ChevronsDown className="size-4" />
                    </button>
                )}

                {isQueueOpen ? (
                    <div className="flex items-center gap-3">
                        <StageArtwork
                            track={currentTrack}
                            creator={currentCreator}
                            compact
                            animate={isPlaying}
                        />
                        {renderMeta()}
                    </div>
                ) : (
                    <>
                        <StageArtwork
                            track={currentTrack}
                            creator={currentCreator}
                            animate={isPlaying}
                        />
                        {renderMeta()}
                    </>
                )}

                <div className="stage-progress-grid stage-progress-panel">
                    <span>{formatDuration(sliderValue * duration)}</span>
                    <Slider
                        aria-label="Track progress"
                        value={sliderValue}
                        minValue={0}
                        maxValue={1}
                        step={0.001}
                        onChange={handleSliderChange}
                        onChangeEnd={handleSliderChangeEnd}
                        isDisabled={!duration}
                        className="stage-progress-slider min-w-0"
                    >
                        <Slider.Track className="stage-slider-track stage-progress-slider-track">
                            <Slider.Fill className="stage-slider-fill stage-progress-slider-fill" />
                            <Slider.Thumb className="stage-slider-thumb stage-progress-slider-thumb" />
                        </Slider.Track>
                    </Slider>
                    <span>{formatDuration(duration)}</span>
                </div>

                <div className="stage-controls" aria-label="Playback controls">
                    <ControlButton
                        label="Shuffle"
                        active={isShuffling}
                        onClick={toggleShuffle}
                    >
                        <Shuffle className="size-5" />
                    </ControlButton>
                    <ControlButton
                        label="Previous track"
                        onClick={handlePrevious}
                    >
                        <SkipBack className="size-5" />
                    </ControlButton>
                    <PlayButton
                        playing={isPlaying}
                        progress={sliderValue}
                        size="lg"
                        style={{ '--play-button-size': '52px' }}
                        onClick={handlePlayPause}
                        label={currentTrack.name || 'track'}
                        aria-busy={isFetchingTrack || isBuffering}
                    />
                    <ControlButton label="Next track" onClick={handleSkip}>
                        <SkipForward className="size-5" />
                    </ControlButton>
                    <ControlButton
                        label="Repeat track"
                        active={isLooping}
                        onClick={() => setIsLooping((current) => !current)}
                    >
                        <Repeat className="size-5" />
                    </ControlButton>
                </div>

                <div className="stage-extras">
                    <VolumeSlider
                        className="min-w-0 flex-1"
                        defaultValue={volumeValue}
                        onChange={setVolumeValue}
                    />
                    <button
                        type="button"
                        aria-label="Toggle playback queue"
                        aria-pressed={isQueueOpen}
                        onClick={() => setIsQueueOpen((current) => !current)}
                        className="stage-queue-toggle"
                    >
                        <List className="size-5" />
                        <QueueBadge count={upcomingTracks.length} />
                    </button>
                </div>

                {isQueueOpen && renderQueue()}
            </div>
        )
    }

    return (
        <>
            <AudioElement
                audioRef={audioRef}
                audioSrc={audioSrc}
                isPlaying={isPlaying}
                isLooping={isLooping}
                onMetadataLoaded={handleMetadataLoaded}
                onTimeUpdate={handleTimeUpdate}
                onBufferingStart={() => setIsBuffering(true)}
                onBufferingEnd={() => setIsBuffering(false)}
                onEnded={() => {
                    if (isPlaying) handleSkip()
                }}
            />

            {isCollapsed ? (
                <CollapsedPlayer
                    track={currentTrack}
                    creator={currentCreator}
                    isPlaying={isPlaying}
                    progress={sliderValue}
                    duration={duration}
                    volume={volumeValue}
                    queueCount={upcomingTracks.length}
                    isBusy={isFetchingTrack || isBuffering}
                    onProgressChange={handleSliderChange}
                    onProgressChangeEnd={handleSliderChangeEnd}
                    onVolumeChange={setVolumeValue}
                    onPlayPause={handlePlayPause}
                    onPrevious={handlePrevious}
                    onNext={handleSkip}
                    onOpenQueue={() => {
                        setIsQueueOpen(true)
                        onCollapsedChange(false)
                    }}
                    onExpand={() => onCollapsedChange(false)}
                />
            ) : (
                <aside className="stage-player" aria-label="Now playing">
                    {renderStageContent({ showCollapse: true })}
                </aside>
            )}

            <div className="player-mini-bar">
                <TrackVisual
                    track={currentTrack}
                    creator={currentCreator}
                    className="size-12 rounded-lg"
                    avatarClassName="size-2/3"
                    sizes="48px"
                />
                <button
                    type="button"
                    onClick={() => setIsSheetOpen(true)}
                    className="min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    aria-label="Open full player"
                >
                    <span className="block truncate text-sm font-bold text-foreground">
                        {currentTrack.name || 'Unknown track'}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                        {currentCreator?.username ||
                            currentTrack.artist ||
                            'Unknown creator'}
                    </span>
                </button>
                <PlayButton
                    playing={isPlaying}
                    progress={sliderValue}
                    size="sm"
                    onClick={handlePlayPause}
                    label={currentTrack.name || 'track'}
                    aria-busy={isFetchingTrack || isBuffering}
                />
                <button
                    type="button"
                    aria-label="Open playback queue"
                    onClick={() => {
                        setIsQueueOpen(true)
                        setIsSheetOpen(true)
                    }}
                    className="stage-queue-toggle"
                >
                    <List className="size-5" />
                    <QueueBadge count={upcomingTracks.length} />
                </button>
            </div>

            {isSheetOpen && (
                <section className="player-sheet" aria-label="Full player">
                    {renderStageContent({ showClose: true })}
                </section>
            )}
        </>
    )
}
