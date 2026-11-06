import { describe, expect, it } from 'vitest'

import { getEmbeddedTrackCreators } from './useTrackCreators'

describe('getEmbeddedTrackCreators', () => {
    it('indexes creator-enriched tracks without requiring profile requests', () => {
        const creator = {
            id: 42,
            username: 'listener',
            avatar: { shape: 'ghost' },
        }

        expect(
            getEmbeddedTrackCreators([
                { id: 1, creator_id: 42, creator },
                { id: 2, creator_id: 7 },
            ])
        ).toEqual({ 42: creator })
    })
})
