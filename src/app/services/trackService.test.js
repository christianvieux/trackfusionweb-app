import { afterEach, describe, expect, it, vi } from 'vitest'

import { apiClient } from './apiClient'
import { fetchPlaybackUrl, fetchRecentTrackPage } from './trackService'

afterEach(() => {
    vi.restoreAllMocks()
})

describe('fetchRecentTrackPage', () => {
    it('requests a bounded numbered collection page', async () => {
        const page = {
            tracks: [{ id: 9 }],
            pageInfo: { page: 2, limit: 6, totalCount: 13, totalPages: 3 },
        }
        const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: page })

        await expect(fetchRecentTrackPage(2, 6)).resolves.toEqual(page)
        expect(get).toHaveBeenCalledWith('/tracks/public', {
            params: { paginated: true, page: 2, limit: 6 },
        })
    })
})

describe('fetchPlaybackUrl', () => {
    it('uses the Audius stream endpoint without proxying the track', async () => {
        const get = vi.spyOn(apiClient, 'get')

        await expect(
            fetchPlaybackUrl({
                id: 'audius:abc/123',
                source: 'audius',
                sourceId: 'abc/123',
            })
        ).resolves.toEqual({
            url: 'https://api.audius.co/v1/tracks/abc%2F123/stream',
        })
        expect(get).not.toHaveBeenCalled()
    })

    it('keeps existing TrackFusion playback authorization unchanged', async () => {
        const get = vi.spyOn(apiClient, 'get').mockResolvedValue({
            data: { url: 'https://media.example.test/signed' },
        })

        await expect(fetchPlaybackUrl({ id: 42 })).resolves.toEqual({
            url: 'https://media.example.test/signed',
        })
        expect(get).toHaveBeenCalledWith('/tracks/42/authorized-url')
    })
})
