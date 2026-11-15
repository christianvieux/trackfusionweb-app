import { afterEach, describe, expect, it, vi } from 'vitest'

import { createQueueTrack, insertQueueItem } from './utils'

afterEach(() => {
    vi.unstubAllGlobals()
})

const tracks = ['a', 'b', 'c'].map((uniqueId) => ({ uniqueId }))

describe('queue drag and drop utilities', () => {
    it('initializes a playable Stage queue item without randomUUID', () => {
        vi.stubGlobal('crypto', {
            getRandomValues(bytes) {
                bytes.fill(0)
                return bytes
            },
        })

        const queueTrack = createQueueTrack({ id: 42, name: 'Fallback song' })

        expect(queueTrack).toMatchObject({
            id: 42,
            trackId: 42,
            name: 'Fallback song',
            uniqueId: '00000000-0000-4000-8000-000000000000',
        })

        const { targetList } = insertQueueItem({
            sourceList: [],
            targetList: tracks,
            queueItem: queueTrack,
            targetQueueItem: tracks[0],
            placement: 'above',
        })

        expect(targetList[0]).toBe(queueTrack)
        expect(targetList.map((track) => track.uniqueId)).toEqual([
            '00000000-0000-4000-8000-000000000000',
            'a',
            'b',
            'c',
        ])
    })

    it('reorders a track within the same list', () => {
        const { targetList } = insertQueueItem({
            sourceList: tracks,
            targetList: tracks,
            queueItem: tracks[0],
            targetQueueItem: tracks[2],
            placement: 'below',
        })

        expect(targetList.map((track) => track.uniqueId)).toEqual([
            'b',
            'c',
            'a',
        ])
    })

    it('moves a track between queue and playlist without duplicating it', () => {
        const queue = [tracks[0]]
        const playlist = [tracks[1], tracks[2]]
        const { sourceList, targetList } = insertQueueItem({
            sourceList: playlist,
            targetList: queue,
            queueItem: tracks[2],
            targetQueueItem: tracks[0],
            placement: 'above',
        })

        expect(sourceList.map((track) => track.uniqueId)).toEqual(['b'])
        expect(targetList.map((track) => track.uniqueId)).toEqual(['c', 'a'])
    })
})
