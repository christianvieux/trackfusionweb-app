import { describe, expect, it } from 'vitest'

import {
    initializeReleaseStatus,
    isRecentlyPublished,
    markReleaseViewed,
    RELEASE_VIEW_STORAGE_KEY,
} from './releaseStatus'

function createStorage(initialValues = {}) {
    const values = new Map(Object.entries(initialValues))

    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null
        },
        setItem(key, value) {
            values.set(key, value)
        },
    }
}

const release = {
    version: '1.2.0',
    date: '2026-11-06',
    highlight: true,
}

describe('release status', () => {
    it('starts first-time visitors at the current release without a NEW state', () => {
        const storage = createStorage()

        expect(
            initializeReleaseStatus(
                storage,
                release,
                new Date('2026-11-07T12:00:00Z')
            )
        ).toBe(false)
        expect(storage.getItem(RELEASE_VIEW_STORAGE_KEY)).toBe('1.2.0')
    })

    it('shows a recent highlighted release to returning visitors', () => {
        const storage = createStorage({
            [RELEASE_VIEW_STORAGE_KEY]: '1.1.0',
        })

        expect(
            initializeReleaseStatus(
                storage,
                release,
                new Date('2026-11-10T12:00:00Z')
            )
        ).toBe(true)
    })

    it('does not mark old or quiet releases as new', () => {
        expect(
            isRecentlyPublished(release, new Date('2026-11-14T00:00:01Z'))
        ).toBe(false)
        expect(
            isRecentlyPublished(
                { ...release, highlight: false },
                new Date('2026-11-07T00:00:00Z')
            )
        ).toBe(false)
    })

    it('persists the viewed release', () => {
        const storage = createStorage()

        expect(markReleaseViewed(storage, release.version)).toBe(true)
        expect(storage.getItem(RELEASE_VIEW_STORAGE_KEY)).toBe('1.2.0')
    })
})
