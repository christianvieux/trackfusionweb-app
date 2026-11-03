'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'

import Pagination from '../../pagination/component'

import { useTrackEvents } from '../../../context/TrackEventsContext'
import { useDebounce } from '../../../hooks/useDebounce'

import {
    DEFAULT_TRACK_LAYOUT,
    FUSE_OPTIONS,
    ROWS_PER_PAGE,
    TRACK_LAYOUTS,
    initialFilters,
} from '../constants'

import { getCreatorDisplayName, trackMatchesFilters } from '../utils'
import useTrackCreators from '../hooks/useTrackCreators'

import TrackFilters from './TrackFilters'
import TrackLayoutSwitcher from './TrackLayoutSwitcher'
import TrackListEmptyState from './TrackListEmptyState'
import TrackRowsView from './TrackRowsView'
import TrackSpotlightView from './TrackSpotlightView'
import TrackTilesView from './TrackTilesView'

function getSearchedTracks(tracks, debouncedSearch, fuse) {
    if (!debouncedSearch) return tracks

    return fuse.search(debouncedSearch).map((result) => result.item.track)
}

function getFilteredTracks(tracks, filters) {
    return tracks.filter((track) =>
        trackMatchesFilters(track, filters.includes, filters.excludes)
    )
}

function getTotalPages(trackCount) {
    return Math.max(1, Math.ceil(trackCount / ROWS_PER_PAGE))
}

function getPaginatedTracks(tracks, page) {
    const start = (page - 1) * ROWS_PER_PAGE
    return tracks.slice(start, start + ROWS_PER_PAGE)
}

export default function TrackListTable({
    trackList: tracks = [],
    setTrackList = () => {},
    title,
    emptyMessage = 'No tracks found',
    className = '',
}) {
    const { lastUpdatedTrack, lastDeletedTrackId } = useTrackEvents()

    const [filters, setFilters] = useState(initialFilters)
    const [page, setPage] = useState(1)
    const [layout, setLayout] = useState(DEFAULT_TRACK_LAYOUT)
    const searchInputRef = useRef(null)

    const toggleFilter = useCallback((filterType, value) => {
        setFilters((current) => {
            const currentValues = current.includes[filterType] || []
            const nextValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value]

            return {
                ...current,
                includes: {
                    ...current.includes,
                    [filterType]: nextValues,
                },
            }
        })
    }, [])

    const creatorsById = useTrackCreators(tracks)

    const debouncedSearch = useDebounce(filters.searchTerm, 300)
    const effectiveSearch = filters.searchTerm ? debouncedSearch : ''

    const searchableTracks = useMemo(
        () =>
            tracks.map((track) => ({
                track,
                creator: getCreatorDisplayName(creatorsById, track),
            })),
        [creatorsById, tracks]
    )

    const fuse = useMemo(() => {
        return new Fuse(searchableTracks, FUSE_OPTIONS)
    }, [searchableTracks])

    const searchedTracks = useMemo(() => {
        return getSearchedTracks(tracks, effectiveSearch, fuse)
    }, [tracks, effectiveSearch, fuse])

    const filteredTracks = useMemo(() => {
        return getFilteredTracks(searchedTracks, {
            includes: filters.includes,
            excludes: filters.excludes,
        })
    }, [searchedTracks, filters.excludes, filters.includes])

    const hasActiveFilters = useMemo(() => {
        return [filters.includes, filters.excludes].some((filterGroup) =>
            Object.values(filterGroup).some((values = []) => values.length > 0)
        )
    }, [filters.excludes, filters.includes])

    const totalPages = useMemo(() => {
        return getTotalPages(filteredTracks.length)
    }, [filteredTracks.length])

    const paginatedTracks = useMemo(() => {
        return getPaginatedTracks(filteredTracks, page)
    }, [filteredTracks, page])

    const updateTrackInList = useCallback(
        (updatedTrack) => {
            if (!updatedTrack?.id) return

            setTrackList((currentTracks = []) =>
                currentTracks.map((track) =>
                    Number(track.id) === Number(updatedTrack.id)
                        ? { ...track, ...updatedTrack }
                        : track
                )
            )
        },
        [setTrackList]
    )

    const removeTrackFromList = useCallback(
        (trackId) => {
            if (!trackId) return

            setTrackList((currentTracks = []) =>
                currentTracks.filter(
                    (track) => Number(track.id) !== Number(trackId)
                )
            )
        },
        [setTrackList]
    )

    const clearSearch = useCallback(() => {
        setFilters((current) => ({ ...current, searchTerm: '' }))
        requestAnimationFrame(() => searchInputRef.current?.focus())
    }, [])

    const clearFilters = useCallback(() => {
        setFilters((current) => ({
            ...current,
            includes: {},
            excludes: {},
        }))
    }, [])

    useEffect(() => {
        if (!lastUpdatedTrack?.track) return

        updateTrackInList(lastUpdatedTrack.track)
    }, [lastUpdatedTrack, updateTrackInList])

    useEffect(() => {
        if (!lastDeletedTrackId?.trackId) return

        removeTrackFromList(lastDeletedTrackId.trackId)
    }, [lastDeletedTrackId, removeTrackFromList])

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, filters.includes, filters.excludes, tracks])

    return (
        <div
            id="Track_List_Table"
            className={`track-browser flex min-h-0 flex-col gap-3 rounded-[14px] text-foreground ${className}`}
        >
            <div
                className={`flex flex-wrap items-center gap-3 ${
                    title ? 'justify-between' : 'justify-end'
                }`}
            >
                {title && (
                    <div className="flex min-w-0 items-baseline gap-2">
                        <h1 className="truncate text-[clamp(1.4rem,4cqw,1.9rem)] font-bold text-foreground">
                            {title}
                        </h1>
                        <span className="shrink-0 text-xs text-muted-foreground sm:text-sm">
                            {filteredTracks.length}{' '}
                            {filteredTracks.length === 1 ? 'track' : 'tracks'}
                        </span>
                    </div>
                )}

                <TrackLayoutSwitcher layout={layout} onChange={setLayout} />
            </div>

            <TrackFilters
                filters={filters}
                setFilters={setFilters}
                onToggleFilter={toggleFilter}
                searchInputRef={searchInputRef}
                onClearSearch={clearSearch}
                onClearFilters={clearFilters}
            />

            <div className="min-h-0 flex-1">
                {filteredTracks.length === 0 ? (
                    <TrackListEmptyState
                        message={emptyMessage}
                        query={effectiveSearch}
                        hasActiveFilters={hasActiveFilters}
                        onClearSearch={clearSearch}
                        onClearFilters={clearFilters}
                    />
                ) : null}

                {filteredTracks.length > 0 && layout === TRACK_LAYOUTS.ROWS && (
                    <TrackRowsView
                        tracks={paginatedTracks}
                        creatorsById={creatorsById}
                        emptyMessage={emptyMessage}
                        onFilter={toggleFilter}
                    />
                )}

                {filteredTracks.length > 0 &&
                    layout === TRACK_LAYOUTS.TILES && (
                        <TrackTilesView
                            tracks={paginatedTracks}
                            creatorsById={creatorsById}
                            emptyMessage={emptyMessage}
                        />
                    )}

                {filteredTracks.length > 0 &&
                    layout === TRACK_LAYOUTS.SPOTLIGHT && (
                        <TrackSpotlightView
                            tracks={paginatedTracks}
                            creatorsById={creatorsById}
                            emptyMessage={emptyMessage}
                        />
                    )}
            </div>

            {filteredTracks.length > 0 && (
                <div
                    id="Pagination"
                    className="flex shrink-0 justify-center pt-2"
                >
                    <Pagination
                        page={page}
                        total={totalPages}
                        onChange={setPage}
                    />
                </div>
            )}
        </div>
    )
}
