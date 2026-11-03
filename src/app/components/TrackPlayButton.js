'use client'

import { useEffect, useRef } from 'react'

import { useTrackManager } from '../context/TrackManagerContext'

import PlayButton from './PlayButton'

export default function TrackPlayButton({
    track,
    playlist = [],
    className = '',
    size = 'md',
}) {
    const {
        currentTrack,
        isTrackReadyInPlayer,
        isPlaying: playerIsPlaying,
        startPlaylist,
        resumeTrack,
        skipToTrack,
        pauseTrack,
        queue,
        playlist: managerPlaylist,
        audioRef,
    } = useTrackManager()

    const buttonRef = useRef(null)

    const isCurrentTrack =
        currentTrack?.id != null &&
        track?.id != null &&
        String(currentTrack.id) === String(track.id)
    const isLoading = isCurrentTrack && !isTrackReadyInPlayer
    const isPlaying = isCurrentTrack && playerIsPlaying

    const isInQueue = queue.some((item) => item.uniqueId === track.uniqueId)
    const isInPlaylist = managerPlaylist.some(
        (item) => item.uniqueId === track.uniqueId
    )

    const isManagedTrack = isInQueue || isInPlaylist
    useEffect(() => {
        const button = buttonRef.current
        const audio = audioRef.current

        if (!button) return undefined

        function updateProgress() {
            const duration = audio?.duration || 0
            const progress = duration > 0 ? audio.currentTime / duration : 0
            button.style.setProperty(
                '--progress',
                String(Math.min(1, Math.max(0, progress)))
            )
        }

        if (!isCurrentTrack || !audio) {
            button.style.setProperty('--progress', '0')
            return undefined
        }

        updateProgress()
        audio.addEventListener('timeupdate', updateProgress)
        audio.addEventListener('durationchange', updateProgress)
        audio.addEventListener('loadedmetadata', updateProgress)

        return () => {
            audio.removeEventListener('timeupdate', updateProgress)
            audio.removeEventListener('durationchange', updateProgress)
            audio.removeEventListener('loadedmetadata', updateProgress)
        }
    }, [audioRef, isCurrentTrack, isTrackReadyInPlayer])

    function handlePress() {
        if (isCurrentTrack) {
            if (isPlaying) {
                pauseTrack()
                return
            }

            resumeTrack()
            return
        }

        if (isManagedTrack) {
            skipToTrack(track.uniqueId)
            return
        }

        startPlaylist(playlist, track)
    }

    return (
        <PlayButton
            ref={buttonRef}
            playing={isPlaying}
            size={size}
            onClick={handlePress}
            label={track?.name || 'track'}
            aria-busy={isLoading}
            className={className}
        />
    )
}
