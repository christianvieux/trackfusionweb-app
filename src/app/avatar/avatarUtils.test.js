import { describe, expect, it } from 'vitest'

import { GUEST_IDENTITY } from './constants'
import {
    generateAvatarSuggestions,
    generateDefaultAvatar,
    isValidAvatarConfig,
    resolveUserAvatar,
} from './avatarUtils'

describe('avatar utilities', () => {
    it('generates a stable default from the numeric user id', () => {
        expect(generateDefaultAvatar(42)).toEqual(generateDefaultAvatar('42'))
        expect(generateDefaultAvatar(42)).not.toEqual(generateDefaultAvatar(43))
        expect(isValidAvatarConfig(generateDefaultAvatar(42))).toBe(true)
    })

    it('uses a saved avatar before the generated default', () => {
        const saved = {
            shape: 'heart',
            expression: 'happy',
            color: '#EC4899',
            seed: 'abc123',
        }
        expect(resolveUserAvatar({ userId: 42, avatar: saved })).toEqual(saved)
    })

    it('uses one fixed guest identity only when explicitly unauthenticated', () => {
        expect(GUEST_IDENTITY.username).toBe('Guest')
        expect(resolveUserAvatar({ isGuest: true })).toEqual(
            GUEST_IDENTITY.avatar
        )
        expect(resolveUserAvatar({})).toBeNull()
    })

    it('keeps the original suggestion after shuffle and avoids duplicates', () => {
        const original = generateDefaultAvatar(42)
        const first = generateAvatarSuggestions(42, 0)
        const shuffled = generateAvatarSuggestions(42, 1)

        expect(first).toHaveLength(6)
        expect(shuffled).toHaveLength(6)
        expect(shuffled[0]).toEqual(original)
        expect(new Set(shuffled.map(JSON.stringify))).toHaveLength(6)
        expect(shuffled).not.toEqual(first)
    })
})
