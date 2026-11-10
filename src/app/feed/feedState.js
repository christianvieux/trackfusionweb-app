import {
    DEFAULT_TRACK_LAYOUT,
    TRACK_LAYOUTS,
} from '../components/TrackList/constants'

export const FEED_FILTER_TYPES = ['category', 'genre', 'mood']

const VALID_LAYOUTS = new Set(Object.values(TRACK_LAYOUTS))

function getFilterValues(searchParams, filterType) {
    return [...new Set(searchParams.getAll(filterType))].filter(Boolean)
}

export function parseFeedState(searchParams) {
    const params = new URLSearchParams(searchParams?.toString())
    const parsedPage = Number(params.get('page'))
    const requestedLayout = params.get('layout')

    return {
        searchTerm: params.get('search') || '',
        includes: Object.fromEntries(
            FEED_FILTER_TYPES.map((filterType) => [
                filterType,
                getFilterValues(params, filterType),
            ])
        ),
        layout: VALID_LAYOUTS.has(requestedLayout)
            ? requestedLayout
            : DEFAULT_TRACK_LAYOUT,
        page:
            Number.isSafeInteger(parsedPage) && parsedPage > 0
                ? parsedPage
                : 1,
    }
}

export function serializeFeedState(state) {
    const params = new URLSearchParams()

    if (state.searchTerm) params.set('search', state.searchTerm)

    FEED_FILTER_TYPES.forEach((filterType) => {
        const values = [...new Set(state.includes?.[filterType] || [])]
        values
            .filter(Boolean)
            .forEach((value) => params.append(filterType, value))
    })

    if (state.layout && state.layout !== DEFAULT_TRACK_LAYOUT) {
        params.set('layout', state.layout)
    }

    if (state.page > 1) params.set('page', String(state.page))

    return params.toString()
}

export function hasFeedCollectionQuery(state) {
    return Boolean(
        state.searchTerm ||
            FEED_FILTER_TYPES.some(
                (filterType) => state.includes?.[filterType]?.length
            )
    )
}

export function clampFeedPage(page, totalPages) {
    const safeTotalPages = Math.max(1, Number(totalPages) || 1)
    return Math.min(Math.max(1, Number(page) || 1), safeTotalPages)
}
