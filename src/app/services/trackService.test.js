import { afterEach, describe, expect, it, vi } from 'vitest'

import { apiClient } from './apiClient'
import {
    fetchUploadConstraints,
    fetchRecentTrackPage,
    getProcessingProgress,
    getQueuedUploadReference,
} from './trackService'

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

describe('upload lifecycle helpers', () => {
    it('loads the authoritative backend constraints', async () => {
        const constraints = {
            audio: { maxBytes: 100 * 1024 * 1024 },
            image: { maxBytes: 8 * 1024 * 1024, minWidth: 64 },
            metadata: { required: [] },
        }
        const get = vi
            .spyOn(apiClient, 'get')
            .mockResolvedValue({ data: constraints })

        await expect(fetchUploadConstraints()).resolves.toEqual(constraints)
        expect(get).toHaveBeenCalledWith('/upload/constraints')
    })

    it('queues only the stable storage key rather than a signed URL', () => {
        expect(
            getQueuedUploadReference({
                key: 'uploads/42/demo.m4a',
                uploadUrl: 'https://storage.example/signed',
                publicUrl: 'uploads/42/demo.m4a',
            })
        ).toEqual({ key: 'uploads/42/demo.m4a' })
    })

    it('turns worker stages into monotonic user progress', () => {
        expect(getProcessingProgress('waiting')).toBe(72)
        expect(getProcessingProgress('active', 'Validating audio...')).toBe(80)
        expect(getProcessingProgress('active', 'Finalizing upload...')).toBe(96)
        expect(getProcessingProgress('active', 'Upload complete!')).toBe(99)
    })
})
