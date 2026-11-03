import { getColorForAttribute } from '../../../config/Colors'

function getStableTrackIdentity(track = {}) {
    const persistedId = track.trackId ?? track.id
    if (persistedId != null) return `track:${String(persistedId)}`

    const descriptiveIdentity = [
        track.name,
        track.artist,
        track.creator_id,
        track.category,
        track.genre,
        track.mood,
    ]
        .map((value) =>
            String(value ?? '')
                .trim()
                .toLowerCase()
        )
        .join('|')

    return descriptiveIdentity.replaceAll('|', '')
        ? `attributes:${descriptiveIdentity}`
        : `instance:${String(track.uniqueId ?? 'track')}`
}

function hashTrackIdentity(track = {}) {
    const identity = getStableTrackIdentity(track)
    let hash = 2166136261

    for (const character of identity) {
        hash ^= character.charCodeAt(0)
        hash = Math.imul(hash, 16777619)
    }

    return hash >>> 0
}

export function getTrackKey(track, fallbackKey) {
    return track.uniqueId ?? track.id ?? fallbackKey
}

export function hasTrackArtwork(track = {}) {
    return (
        typeof track.image_url === 'string' && track.image_url.trim() !== ''
    )
}

export function shouldUseTrackAvatarFallback(
    track = {},
    artworkFailed = false
) {
    return !hasTrackArtwork(track) || artworkFailed
}

export function parseAttributes(attributes = '') {
    return String(attributes)
        .replace(/[{}]/g, '')
        .split(',')
        .map((attribute) => attribute.trim())
        .filter(Boolean)
}

export function sortAttributesByColor(attributes = []) {
    return [...attributes].sort((a, b) =>
        getColorForAttribute(a).localeCompare(getColorForAttribute(b))
    )
}

export function getSortedAttributes(attributes = '') {
    return sortAttributesByColor(parseAttributes(attributes))
}

export function trackMatchesFilters(track, includes = {}, excludes = {}) {
    return Object.keys(includes).every((type) => {
        const includeValues = includes[type] || []
        const excludeValues = excludes[type] || []
        const trackValue = String(track[type] || '').toLowerCase()

        return (
            includeValues.every((value) =>
                trackValue.includes(value.toLowerCase())
            ) &&
            !excludeValues.some((value) =>
                trackValue.includes(value.toLowerCase())
            )
        )
    })
}

export function capitalize(str = '') {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getCreatorForTrack(creatorsById = {}, track) {
    if (track?.creator_id == null) return null
    return creatorsById[String(track.creator_id)] || null
}

export function getCreatorDisplayName(creatorsById = {}, track) {
    const creator = getCreatorForTrack(creatorsById, track)
    return creator?.username || track?.creator || ''
}

export function getTrackAttributeSummary(track = {}) {
    const attributes = [
        track.category,
        ...parseAttributes(track.genre),
        ...parseAttributes(track.mood),
    ].filter(Boolean)

    return [...new Set(attributes)].join(' · ')
}

export function getTrackVisualPalette(track = {}) {
    const hash = hashTrackIdentity(track)
    const baseHue = hash % 360
    const hueDirection = hash & 1 ? 1 : -1
    const hueSpread = 20 + ((hash >>> 8) % 38)
    const middleHue = (baseHue + hueDirection * hueSpread + 360) % 360
    const endHue = (middleHue + hueDirection * 12 + 360) % 360
    const saturation = 48 + ((hash >>> 16) % 17)
    const lightness = 29 + ((hash >>> 24) % 8)

    return {
        from: `hsl(${baseHue} ${saturation}% ${lightness}%)`,
        via: `hsl(${middleHue} ${Math.max(42, saturation - 8)}% ${Math.max(19, lightness - 10)}%)`,
        to: `hsl(${endHue} ${Math.max(34, saturation - 16)}% ${Math.max(9, lightness - 21)}%)`,
    }
}

export function getStageVisualBackground(track = {}) {
    const palette = getTrackVisualPalette(track)

    return `linear-gradient(135deg, ${palette.from}, ${palette.to})`
}
