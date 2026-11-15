import { describe, expect, it } from 'vitest'

import packageMetadata from '../../../package.json'
import { APP_VERSION, RELEASES, RELEASE_NOTE_TYPES } from './releases'

const workingRoutes = new Set(['/changelog', '/feed', '/how-it-works'])

describe('release data', () => {
    it('keeps the current release aligned with the package version', () => {
        expect(APP_VERSION).toBe(packageMetadata.version)
        expect(RELEASES[0].version).toBe(APP_VERSION)
        expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/)
    })

    it('uses supported note categories and known application routes', () => {
        RELEASES.forEach((release) => {
            expect(release.summary.trim().length).toBeGreaterThan(0)

            release.notes.forEach((note) => {
                expect(RELEASE_NOTE_TYPES).toContain(note.type)
                expect(note.area.trim().length).toBeGreaterThan(0)

                if (note.link) {
                    expect(workingRoutes.has(note.link.href)).toBe(true)
                    expect(note.link.label.trim().length).toBeGreaterThan(0)
                }
            })
        })
    })

    it('keeps the next version unreleased and preserves verified releases', () => {
        expect(
            RELEASES.map(({ version, status, date }) => ({
                version,
                status,
                date,
            }))
        ).toEqual([
            { version: '1.1.0', status: 'unreleased', date: null },
            { version: '1.0.1', status: undefined, date: '2026-11-10' },
            { version: '1.0.0', status: undefined, date: '2026-11-06' },
        ])

        RELEASES.slice(1).forEach((release) => {
            expect(release.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
        })
    })
})
