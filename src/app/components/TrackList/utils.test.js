import { describe, expect, it } from 'vitest'

import {
    getCreatorDisplayName,
    getCreatorForTrack,
    getTrackAttributeSummary,
    getTrackVisualPalette,
    hasTrackArtwork,
    shouldUseTrackAvatarFallback,
    trackMatchesFilters,
} from './utils'

describe('track list utilities', () => {
    const track = {
        creator_id: 42,
        category: 'Music',
        genre: '{Pop, Electronic}',
        mood: ['Happy', 'Pop'],
    }
    const creatorsById = {
        42: { id: 42, username: 'listener' },
    }

    it('resolves creator data using numeric or string ids', () => {
        expect(getCreatorForTrack(creatorsById, track)).toEqual(
            creatorsById[42]
        )
        expect(getCreatorDisplayName(creatorsById, track)).toBe('listener')
    })

    it('builds a compact, deduplicated attribute summary', () => {
        expect(getTrackAttributeSummary(track)).toBe(
            'Music · Pop · Electronic · Happy'
        )
    })

    it('uses creator avatars only when artwork is absent or fails', () => {
        const trackWithArtwork = {
            image_url: 'https://images.example/cover.jpg',
        }

        expect(hasTrackArtwork(trackWithArtwork)).toBe(true)
        expect(shouldUseTrackAvatarFallback(trackWithArtwork)).toBe(false)
        expect(shouldUseTrackAvatarFallback(trackWithArtwork, true)).toBe(true)
        expect(shouldUseTrackAvatarFallback({ image_url: '  ' })).toBe(true)
        expect(shouldUseTrackAvatarFallback({})).toBe(true)
    })

    it('retains the existing include and exclude filter behavior', () => {
        expect(
            trackMatchesFilters(
                track,
                { category: ['music'] },
                { category: [] }
            )
        ).toBe(true)
        expect(
            trackMatchesFilters(
                track,
                { category: ['music'] },
                { category: ['mus'] }
            )
        ).toBe(false)
    })

    it('assigns stable but varied thumbnail palettes', () => {
        expect(getTrackVisualPalette({ id: 1 })).toEqual(
            getTrackVisualPalette({ id: 1 })
        )
        expect(getTrackVisualPalette({ id: 1 })).not.toEqual(
            getTrackVisualPalette({ id: 2 })
        )

        expect(
            getTrackVisualPalette({ id: 1, uniqueId: 'queue-copy-a' })
        ).toEqual(getTrackVisualPalette({ id: 1, uniqueId: 'queue-copy-b' }))

        expect(
            getTrackVisualPalette({
                name: 'Midnight Static',
                creator_id: 9,
                genre: 'Jazz',
            })
        ).toEqual(
            getTrackVisualPalette({
                name: 'Midnight Static',
                creator_id: 9,
                genre: 'Jazz',
            })
        )

        const generatedPalettes = new Set(
            Array.from({ length: 64 }, (_, index) =>
                JSON.stringify(getTrackVisualPalette({ id: index + 1 }))
            )
        )
        expect(generatedPalettes.size).toBeGreaterThanOrEqual(60)
    })
})
