import { afterEach, describe, expect, it, vi } from 'vitest'

import { assignUniqueIdsTo, createTrackInstance } from './trackManagerUtils'

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('playlist initialization', () => {
    it('prepares tracks for playback without randomUUID', () => {
        let nextByte = 0
        vi.stubGlobal('crypto', {
            getRandomValues(bytes) {
                bytes.fill(nextByte)
                nextByte += 1
                return bytes
            },
        })

        const tracks = assignUniqueIdsTo([
            { id: 7, name: 'First song' },
            { id: 8, name: 'Second song' },
        ])

        expect(tracks).toMatchObject([
            {
                id: 7,
                trackId: 7,
                uniqueId: '00000000-0000-4000-8000-000000000000',
            },
            {
                id: 8,
                trackId: 8,
                uniqueId: '01010101-0101-4101-8101-010101010101',
            },
        ])
    })

    it('preserves an existing playlist identity during playback setup', () => {
        const randomUUID = vi.fn()
        vi.stubGlobal('crypto', { randomUUID })

        expect(
            assignUniqueIdsTo([{ id: 7, uniqueId: 'existing-playlist-id' }])
        ).toEqual([{ id: 7, trackId: 7, uniqueId: 'existing-playlist-id' }])
        expect(randomUUID).not.toHaveBeenCalled()
    })
})

describe('track instances', () => {
    it('creates a playable queue instance through the fallback UUID path', () => {
        vi.stubGlobal('crypto', {
            getRandomValues(bytes) {
                bytes.fill(0x2a)
                return bytes
            },
        })

        expect(
            createTrackInstance({
                id: 42,
                name: 'Queued song',
                uniqueId: 'playlist-instance',
            })
        ).toEqual({
            id: 42,
            trackId: 42,
            name: 'Queued song',
            uniqueId: '2a2a2a2a-2a2a-4a2a-aa2a-2a2a2a2a2a2a',
        })
    })
})
