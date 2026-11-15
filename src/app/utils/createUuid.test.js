import { afterEach, describe, expect, it, vi } from 'vitest'

import { createUuid } from './createUuid'

const UUID_V4_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('createUuid', () => {
    it('preserves the native randomUUID implementation when available', () => {
        const randomUUID = vi
            .fn()
            .mockReturnValue('19dcb75e-9732-426a-8c92-6681ba7d4cdd')
        const getRandomValues = vi.fn()
        vi.stubGlobal('crypto', { randomUUID, getRandomValues })

        expect(createUuid()).toBe('19dcb75e-9732-426a-8c92-6681ba7d4cdd')
        expect(randomUUID).toHaveBeenCalledOnce()
        expect(getRandomValues).not.toHaveBeenCalled()
    })

    it('uses getRandomValues when randomUUID is unavailable', () => {
        const getRandomValues = vi.fn((bytes) => {
            bytes.set([
                0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x08, 0x99,
                0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff,
            ])
            return bytes
        })
        vi.stubGlobal('crypto', { getRandomValues })

        expect(createUuid()).toBe('00112233-4455-4677-8899-aabbccddeeff')
        expect(getRandomValues).toHaveBeenCalledOnce()
    })

    it('returns a correctly formatted version 4 UUID from fallback bytes', () => {
        vi.stubGlobal('crypto', {
            getRandomValues(bytes) {
                bytes.fill(0xff)
                return bytes
            },
        })

        expect(createUuid()).toMatch(UUID_V4_PATTERN)
    })
})
