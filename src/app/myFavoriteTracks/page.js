'use client'

import { useEffect } from 'react'

import TrackListSection from '../components/TrackListSection'
import TrackPageLayout from '../components/TrackPageLayout'
import { useFavoriteTracks } from '../context/FavoriteTracksContext'
import withAuth from '../hoc/withAuth'

function MyFavoriteTracksPage() {
    const {
        favoriteTracks,
        setFavoriteTracks,
        ensureLoaded,
        hasLoaded,
        loading,
    } = useFavoriteTracks()

    useEffect(() => {
        ensureLoaded()
    }, [ensureLoaded])

    return (
        <TrackPageLayout>
            <TrackListSection
                title="Favorite Tracks"
                trackList={favoriteTracks}
                setTrackList={setFavoriteTracks}
                emptyMessage={
                    loading || !hasLoaded
                        ? 'Loading favorite tracks...'
                        : 'No favorite tracks yet'
                }
            />
        </TrackPageLayout>
    )
}

export default withAuth(MyFavoriteTracksPage)
