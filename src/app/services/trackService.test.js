import { afterEach, describe, expect, it, vi } from 'vitest'

import { apiClient } from './apiClient'
import { fetchRecentTrackPage } from './trackService'

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
