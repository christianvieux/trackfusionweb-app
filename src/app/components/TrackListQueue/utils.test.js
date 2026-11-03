import { describe, expect, it } from 'vitest'

import { insertQueueItem, isSameAudioTrack } from './utils'

const tracks = ['a', 'b', 'c'].map((uniqueId) => ({ uniqueId }))

describe('queue drag and drop utilities', () => {
    it('matches queue copies to the active persisted track', () => {
        expect(
            isSameAudioTrack(
                { id: 7, uniqueId: 'queue-copy' },
                { trackId: '7', uniqueId: 'playing-copy' }
            )
        ).toBe(true)
        expect(isSameAudioTrack({ id: 7 }, { id: 8 })).toBe(false)
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
