'use client'

import { useEffect, useState } from 'react'

import TrackListSection from '../components/TrackListSection'
import TrackPageLayout from '../components/TrackPageLayout'
import { fetchOwnedTracks } from '../services/userService'
import withAuth from '../hoc/withAuth'

function MyTracksPage() {
    const [ownedTracks, setOwnedTracks] = useState([])

    useEffect(() => {
        async function loadOwnedTracks() {
            try {
                const tracks = await fetchOwnedTracks()
                setOwnedTracks(tracks || [])
            } catch (error) {
                console.error('Failed to fetch owned tracks:', error)
            }
        }

        loadOwnedTracks()
    }, [])

    return (
        <TrackPageLayout>
            <TrackListSection
                title="Your Tracks"
                trackList={ownedTracks}
                setTrackList={setOwnedTracks}
                emptyMessage="No created tracks yet"
            />
        </TrackPageLayout>
    )
}

export default withAuth(MyTracksPage)
