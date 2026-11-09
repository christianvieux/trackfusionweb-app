import { describe, expect, it, vi } from 'vitest'
import {
    isPublicStreamCandidate,
    probeAudius,
    summarizeAudiusTrack,
} from './probeAudius.mjs'

const usableTrack = {
    id: 'abc123',
    title: 'Example',
    user: { name: 'Example creator' },
    is_streamable: true,
    is_available: true,
    is_stream_gated: false,
    is_delete: false,
    is_unlisted: false,
    license: 'CC-BY',
    permalink: 'https://audius.co/creator/example',
}

describe('Audius feasibility probe', () => {
    it('rejects unavailable, gated, deleted, unlisted, and nonstreamable tracks', () => {
        expect(isPublicStreamCandidate(usableTrack)).toBe(true)
        for (const restrictions of [
            { is_streamable: false },
            { is_available: false },
            { is_stream_gated: true },
            { is_delete: true },
            { is_unlisted: true },
        ]) {
            expect(isPublicStreamCandidate({ ...usableTrack, ...restrictions })).toBe(false)
        }
    })

    it('keeps source and license information separate from upload ownership', () => {
        expect(summarizeAudiusTrack(usableTrack)).toEqual({
            source: 'audius',
            sourceId: 'abc123',
            title: 'Example',
            artist: 'Example creator',
            license: 'CC-BY',
            sourceUrl: 'https://audius.co/creator/example',
            candidate: true,
        })
        expect(summarizeAudiusTrack(null)).toBeNull()
    })

    it('inspects metadata and only sends HEAD to the stream endpoint', async () => {
        const fetcher = vi.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: [usableTrack] }),
            })
            .mockResolvedValueOnce({ status: 302 })
        const log = vi.fn()

        const result = await probeAudius({
            fetcher,
            bearerToken: undefined,
            log,
        })

        expect(result.streamHeadStatus).toBe(302)
        expect(fetcher).toHaveBeenCalledTimes(2)
        expect(fetcher.mock.calls[0][0]).toBe(
            'https://api.audius.co/v1/tracks/trending?limit=5'
        )
        expect(fetcher.mock.calls[1][0]).toBe(
            'https://api.audius.co/v1/tracks/abc123/stream'
        )
        expect(fetcher.mock.calls[1][1]).toMatchObject({
            method: 'HEAD',
            redirect: 'manual',
        })
    })

    it('never probes gated streams', async () => {
        const fetcher = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: [{ ...usableTrack, is_stream_gated: true }],
            }),
        })
        const result = await probeAudius({
            fetcher,
            bearerToken: undefined,
            log: vi.fn(),
        })

        expect(result.streamHeadStatus).toBeNull()
        expect(fetcher).toHaveBeenCalledTimes(1)
    })

    it('does not report metadata errors as success', async () => {
        const fetcher = vi.fn().mockResolvedValue({
            ok: false,
            status: 401,
        })
        await expect(
            probeAudius({ fetcher, bearerToken: undefined, log: vi.fn() })
        ).rejects.toThrow('HTTP 401')
    })
})
