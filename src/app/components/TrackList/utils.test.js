import { describe, expect, it } from 'vitest'

import {
    getCreatorDisplayName,
    getCreatorForTrack,
    getTrackAttributeSummary,
    getTrackVisualPalette,
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
    })
})
