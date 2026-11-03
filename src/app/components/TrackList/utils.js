import { getColorForAttribute } from '../../../config/Colors'

const TRACK_VISUAL_PALETTES = Object.freeze([
    { from: '#68224F', via: '#431A48', to: '#1B1028' },
    { from: '#543080', via: '#34245E', to: '#16142D' },
    { from: '#27527A', via: '#263B66', to: '#111A30' },
    { from: '#17605D', via: '#164448', to: '#0C252A' },
    { from: '#276044', via: '#1C4635', to: '#0C241B' },
    { from: '#71501E', via: '#4D341A', to: '#27190C' },
    { from: '#733344', via: '#4D2235', to: '#27101B' },
    { from: '#51418A', via: '#362D68', to: '#181631' },
])

function hashTrackIdentity(track = {}) {
    const identity = String(
        track.id ?? track.uniqueId ?? track.name ?? track.creator_id ?? 'track'
    )
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
    return TRACK_VISUAL_PALETTES[
        hashTrackIdentity(track) % TRACK_VISUAL_PALETTES.length
    ]
}

export function getStageVisualBackground(track = {}) {
    const name = String(track.name || 'TrackFusionWeb')
    const hue =
        (Array.from(name).reduce(
            (sum, character) => sum + character.charCodeAt(0),
            0
        ) %
            70) +
        250

    return `linear-gradient(135deg, hsl(${hue} 55% 34%), hsl(${hue + 35} 65% 10%))`
}
