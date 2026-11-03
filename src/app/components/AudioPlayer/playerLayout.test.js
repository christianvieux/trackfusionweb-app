import { describe, expect, it } from 'vitest'

import { PLAYER_LAYOUTS, normalizePlayerLayout } from './playerLayout'

describe('player layout preference', () => {
    it('keeps the collapsed preference', () => {
        expect(normalizePlayerLayout(PLAYER_LAYOUTS.COLLAPSED)).toBe(
            PLAYER_LAYOUTS.COLLAPSED
        )
    })

    it('falls back to the Stage for missing or unknown values', () => {
        expect(normalizePlayerLayout(null)).toBe(PLAYER_LAYOUTS.STAGE)
        expect(normalizePlayerLayout('floating')).toBe(PLAYER_LAYOUTS.STAGE)
    })
})
