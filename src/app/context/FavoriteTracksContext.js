'use client'

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'

import { fetchFavoriteTracks } from '../services/userService'
import { useSession } from './SessionContext'

const FavoriteTracksContext = createContext({
    favoriteTracks: [],
    setFavoriteTracks: () => {},
    refresh: () => {},
    loading: false,
})

export function FavoriteTracksProvider({ children }) {
    const { user } = useSession()
    const userId = user?.id

    const [favoriteTracks, setFavoriteTracks] = useState([])
    const [loading, setLoading] = useState(false)

    const refresh = useCallback(async () => {
        if (!userId) {
            setFavoriteTracks([])
            return
        }

        try {
            setLoading(true)

            const tracks = await fetchFavoriteTracks(userId)
            setFavoriteTracks(tracks || [])
        } catch (error) {
            console.error('Error fetching favorite tracks:', error)
            setFavoriteTracks([])
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        refresh()
    }, [refresh])

    const value = useMemo(
        () => ({ favoriteTracks, setFavoriteTracks, refresh, loading }),
        [favoriteTracks, loading, refresh]
    )

    return (
        <FavoriteTracksContext.Provider value={value}>
            {children}
        </FavoriteTracksContext.Provider>
    )
}

export function useFavoriteTracks() {
    return useContext(FavoriteTracksContext)
}
