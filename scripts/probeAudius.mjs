/**
 * Read-only catalog feasibility probe.
 *
 * Run with: node scripts/probeAudius.mjs
 * Optional: AUDIUS_API_BEARER_TOKEN=<token> node scripts/probeAudius.mjs
 *
 * It requests metadata for up to five tracks and checks one stream endpoint
 * with HEAD. It does not download audio, import music, or modify the database.
 * Successful metadata/HEAD responses do not establish browser playback,
 * ownership of rights, permission to cache data, or license compliance.
 */
import { pathToFileURL } from 'node:url'

const API_BASE = 'https://api.audius.co/v1'
const REQUEST_TIMEOUT_MS = 10000

export function isPublicStreamCandidate(track) {
    return Boolean(
        track?.id &&
            track.is_streamable === true &&
            track.is_available !== false &&
            track.is_stream_gated !== true &&
            track.is_delete !== true &&
            track.is_unlisted !== true
    )
}

export function summarizeAudiusTrack(track) {
    if (!track || typeof track !== 'object' || !track.id) return null

    return {
        source: 'audius',
        sourceId: String(track.id),
        title: String(track.title || 'Untitled track'),
        artist: String(track.user?.name || 'Unknown artist'),
        license: typeof track.license === 'string' ? track.license : null,
        sourceUrl:
            typeof track.permalink === 'string' ? track.permalink : null,
        candidate: isPublicStreamCandidate(track),
    }
}

function makeHeaders(bearerToken) {
    return bearerToken
        ? { Authorization: `Bearer ${bearerToken}` }
        : {}
}

export async function probeAudius({
    fetcher = fetch,
    bearerToken = process.env.AUDIUS_API_BEARER_TOKEN,
    log = console.log,
} = {}) {
    const headers = makeHeaders(bearerToken)
    const response = await fetcher(`${API_BASE}/tracks/trending?limit=5`, {
        headers,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
        throw new Error(
            `Audius catalog request failed (HTTP ${response.status}).`
        )
    }

    const payload = await response.json()
    if (!Array.isArray(payload?.data)) {
        throw new Error('Audius returned an unexpected track-list format.')
    }

    const tracks = payload.data
        .slice(0, 5)
        .map(summarizeAudiusTrack)
        .filter(Boolean)

    log(`Audius returned ${tracks.length} track metadata records.`)
    for (const track of tracks) {
        log(
            `[${track.candidate ? 'candidate' : 'restricted'}] ${track.title} by ${track.artist} (${track.sourceId}); license: ${track.license || 'not supplied'}`
        )
    }

    const firstCandidate = tracks.find((track) => track.candidate)
    if (!firstCandidate) {
        log('No public, ungated stream candidate was returned.')
        return { tracks, streamHeadStatus: null }
    }

    // HEAD checks endpoint reachability only; never fetch audio bytes.
    let streamHeadStatus = null
    try {
        const streamResponse = await fetcher(
            `${API_BASE}/tracks/${encodeURIComponent(firstCandidate.sourceId)}/stream`,
            {
                method: 'HEAD',
                headers,
                redirect: 'manual',
                signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            }
        )
        streamHeadStatus = streamResponse.status
        log(
            `One stream endpoint returned HTTP ${streamHeadStatus}; real playback and rights remain unverified.`
        )
    } catch {
        log('Stream endpoint HEAD check unavailable; playback remains unverified.')
    }

    return { tracks, streamHeadStatus }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    probeAudius().catch((error) => {
        console.error(`Audius feasibility probe failed: ${error.message}`)
        process.exitCode = 1
    })
}
