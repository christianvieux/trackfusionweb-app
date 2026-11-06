'use client'

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import { fetchFavoriteTracks } from '../services/userService'
import { useSession } from './SessionContext'

const FavoriteTracksContext = createContext({
    favoriteTracks: [],
    setFavoriteTracks: () => {},
    refresh: () => {},
    ensureLoaded: () => {},
    hasLoaded: false,
    loading: false,
})

export function FavoriteTracksProvider({ children }) {
    const { user } = useSession()
    const userId = user?.id

    const [favoriteTracks, setFavoriteTracks] = useState([])
    const [loading, setLoading] = useState(false)
    const [hasLoaded, setHasLoaded] = useState(false)
    const requestRef = useRef(null)
    const userIdRef = useRef(userId)

    const loadFavorites = useCallback(async ({ force = false } = {}) => {
        if (!userId) {
            setFavoriteTracks([])
            setHasLoaded(false)
            return []
        }

        const activeRequest = requestRef.current
        if (!force && activeRequest?.userId === userId) {
            return activeRequest.promise
        }

        setLoading(true)

        const promise = fetchFavoriteTracks(userId)
            .then((tracks) => {
                const nextTracks = tracks || []
                if (
                    userIdRef.current === userId &&
                    requestRef.current?.promise === promise
                ) {
                    setFavoriteTracks(nextTracks)
                    setHasLoaded(true)
                }
                return nextTracks
            })
            .catch((error) => {
                console.error('Error fetching favorite tracks:', error)
                if (
                    userIdRef.current === userId &&
                    requestRef.current?.promise === promise
                ) {
                    setFavoriteTracks([])
                    setHasLoaded(true)
                }
                return []
            })
            .finally(() => {
                const isCurrentRequest =
                    requestRef.current?.promise === promise
                if (isCurrentRequest) {
                    requestRef.current = null
                }
                if (isCurrentRequest && userIdRef.current === userId) {
                    setLoading(false)
                }
            })

        requestRef.current = { userId, promise }
        return promise
    }, [userId])

    const ensureLoaded = useCallback(() => {
        if (hasLoaded) return Promise.resolve(favoriteTracks)
        return loadFavorites()
    }, [favoriteTracks, hasLoaded, loadFavorites])

    const refresh = useCallback(
        () => loadFavorites({ force: true }),
        [loadFavorites]
    )

    useEffect(() => {
        userIdRef.current = userId
        requestRef.current = null
        setFavoriteTracks([])
        setHasLoaded(false)
        setLoading(false)
    }, [userId])

    const value = useMemo(
        () => ({
            favoriteTracks,
            setFavoriteTracks,
            refresh,
            ensureLoaded,
            hasLoaded,
            loading,
        }),
        [ensureLoaded, favoriteTracks, hasLoaded, loading, refresh]
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
