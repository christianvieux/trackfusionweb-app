export const ROWS_PER_PAGE = 6

export const TRACK_LAYOUTS = Object.freeze({
    ROWS: 'rows',
    TILES: 'tiles',
    SPOTLIGHT: 'spotlight',
})

export const DEFAULT_TRACK_LAYOUT = TRACK_LAYOUTS.ROWS

export const initialFilters = {
    filtersList: {},
    includes: {},
    excludes: {},
    searchTerm: '',
}

export const FUSE_OPTIONS = {
    keys: [
        'track.name',
        'track.artist',
        'track.category',
        'track.genre',
        'track.mood',
        'creator',
    ],
    threshold: 0.3,
}
