export const PLAYER_LAYOUT_STORAGE_KEY = 'trackfusionweb-player-layout-v1'

export const PLAYER_LAYOUTS = Object.freeze({
    STAGE: 'stage',
    COLLAPSED: 'collapsed',
})

export function normalizePlayerLayout(value) {
    return value === PLAYER_LAYOUTS.COLLAPSED
        ? PLAYER_LAYOUTS.COLLAPSED
        : PLAYER_LAYOUTS.STAGE
}
