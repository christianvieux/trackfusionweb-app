import { describe, expect, it } from 'vitest'

import { supportsBrowserVolumeControl } from './mediaCapabilities'

describe('browser media capabilities', () => {
    it('hides programmatic volume controls on iOS and iPadOS', () => {
        expect(
            supportsBrowserVolumeControl({
                userAgent:
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
                platform: 'iPhone',
                maxTouchPoints: 5,
            })
        ).toBe(false)
        expect(
            supportsBrowserVolumeControl({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
                platform: 'MacIntel',
                maxTouchPoints: 5,
            })
        ).toBe(false)
    })

    it('keeps volume controls on working desktop and Android browsers', () => {
        expect(
            supportsBrowserVolumeControl({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
                platform: 'MacIntel',
                maxTouchPoints: 0,
            })
        ).toBe(true)
        expect(
            supportsBrowserVolumeControl({
                userAgent: 'Mozilla/5.0 (Linux; Android 15)',
                platform: 'Linux armv8l',
                maxTouchPoints: 5,
            })
        ).toBe(true)
    })
})
