'use client'

import TrackListSection from '../components/TrackListSection'
import TrackPageLayout from '../components/TrackPageLayout'
import { useFavoriteTracks } from '../context/FavoriteTracksContext'
import withAuth from '../hoc/withAuth'

function MyFavoriteTracksPage() {
    const { favoriteTracks, setFavoriteTracks } = useFavoriteTracks()

    return (
        <TrackPageLayout>
            <TrackListSection
                title="Favorite Tracks"
                trackList={favoriteTracks}
                setTrackList={setFavoriteTracks}
                emptyMessage="No favorite tracks yet"
            />
        </TrackPageLayout>
    )
}

export default withAuth(MyFavoriteTracksPage)
