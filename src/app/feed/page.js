'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import TrackListSection from '../components/TrackListSection'
import TrackPageLayout from '../components/TrackPageLayout'
import { ROWS_PER_PAGE } from '../components/TrackList/constants'
import {
    fetchRecentTrackPage,
    fetchRecentTracks,
} from '../services/trackService'

export default function FeedPage() {
    const [publicTracks, setPublicTracks] = useState([])
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        totalCount: 0,
        totalPages: 1,
    })
    const [hasFullCollection, setHasFullCollection] = useState(false)
    const [loading, setLoading] = useState(true)
    const [collectionError, setCollectionError] = useState('')
    const requestVersion = useRef(0)

    const loadPage = useCallback(async (page = 1) => {
        const request = ++requestVersion.current
        setLoading(true)
        setCollectionError('')

        try {
            const result = await fetchRecentTrackPage(page, ROWS_PER_PAGE)
            if (request !== requestVersion.current) return

            if (Array.isArray(result)) {
                setPublicTracks(result)
                setPageInfo({
                    page: 1,
                    totalCount: result.length,
                    totalPages: Math.max(
                        1,
                        Math.ceil(result.length / ROWS_PER_PAGE)
                    ),
                })
                setHasFullCollection(true)
                return
            }

            setPublicTracks(result?.tracks || [])
            setPageInfo(result?.pageInfo || {})
        } catch (error) {
            if (request !== requestVersion.current) return
            console.error('Failed to fetch recent tracks:', error)
            setCollectionError(error.message)
        } finally {
            if (request === requestVersion.current) setLoading(false)
        }
    }, [])

    const loadFullCollection = useCallback(async () => {
        if (hasFullCollection) return

        const request = ++requestVersion.current
        setLoading(true)
        setCollectionError('')

        try {
            const tracks = (await fetchRecentTracks()) || []
            if (request !== requestVersion.current) return

            setPublicTracks(tracks)
            setPageInfo({
                page: 1,
                totalCount: tracks.length,
                totalPages: Math.max(
                    1,
                    Math.ceil(tracks.length / ROWS_PER_PAGE)
                ),
            })
            setHasFullCollection(true)
        } catch (error) {
            if (request !== requestVersion.current) return
            console.error('Failed to fetch the searchable track list:', error)
            setCollectionError(error.message)
        } finally {
            if (request === requestVersion.current) setLoading(false)
        }
    }, [hasFullCollection])

    useEffect(() => {
        loadPage(1)
    }, [loadPage])

    return (
        <TrackPageLayout>
            <TrackListSection
                title="Discover Tracks"
                trackList={publicTracks}
                setTrackList={setPublicTracks}
                emptyMessage="No recent tracks found"
                collectionPagination={{
                    ...pageInfo,
                    isComplete: hasFullCollection,
                    loading,
                    error: collectionError,
                    onPageChange: loadPage,
                    onRequireFullCollection: loadFullCollection,
                }}
            />
        </TrackPageLayout>
    )
}
