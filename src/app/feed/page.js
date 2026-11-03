'use client'

import { useEffect, useState } from 'react'

import TrackListSection from '../components/TrackListSection'
import TrackPageLayout from '../components/TrackPageLayout'
import { fetchRecentTracks } from '../services/trackService'

export default function FeedPage() {
    const [publicTracks, setPublicTracks] = useState([])

    useEffect(() => {
        async function loadTracks() {
            try {
                const tracks = await fetchRecentTracks()
                setPublicTracks(tracks || [])
            } catch (error) {
                console.error('Failed to fetch recent tracks:', error)
            }
        }

        loadTracks()
    }, [])

    return (
        <TrackPageLayout>
            <TrackListSection
                title="Discover Tracks"
                trackList={publicTracks}
                setTrackList={setPublicTracks}
                emptyMessage="No recent tracks found"
            />
        </TrackPageLayout>
    )
}
