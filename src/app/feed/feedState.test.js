import { describe, expect, it } from 'vitest'

import {
    clampFeedPage,
    hasFeedCollectionQuery,
    parseFeedState,
    serializeFeedState,
} from './feedState'

describe('Feed URL state', () => {
    it('round trips search, filters, layout, and page', () => {
        const state = parseFeedState(
            new URLSearchParams(
                'search=night+drive&category=Music&genre=House&genre=Disco&mood=Happy&layout=tiles&page=3'
            )
        )

        expect(state).toEqual({
            searchTerm: 'night drive',
            includes: {
                category: ['Music'],
                genre: ['House', 'Disco'],
                mood: ['Happy'],
            },
            layout: 'tiles',
            page: 3,
        })
        expect(parseFeedState(serializeFeedState(state))).toEqual(state)
        expect(hasFeedCollectionQuery(state)).toBe(true)
    })

    it('falls back safely for invalid and outdated parameters', () => {
        expect(
            parseFeedState(
                new URLSearchParams(
                    'page=2-old&layout=grid&genre=&unknown=discarded'
                )
            )
        ).toEqual({
            searchTerm: '',
            includes: { category: [], genre: [], mood: [] },
            layout: 'rows',
            page: 1,
        })
    })

    it('deduplicates filters and clamps pages after collection changes', () => {
        const state = parseFeedState(
            new URLSearchParams('genre=House&genre=House&page=8')
        )

        expect(state.includes.genre).toEqual(['House'])
        expect(clampFeedPage(state.page, 2)).toBe(2)
        expect(clampFeedPage(state.page, 0)).toBe(1)
    })
})
