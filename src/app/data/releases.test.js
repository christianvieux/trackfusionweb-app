import { describe, expect, it } from 'vitest'

import packageMetadata from '../../../package.json'
import {
    APP_VERSION,
    RELEASES,
    RELEASE_NOTE_TYPES,
} from './releases'

const workingRoutes = new Set(['/changelog', '/feed', '/how-it-works'])

describe('release data', () => {
    it('keeps the current release aligned with the package version', () => {
        expect(APP_VERSION).toBe(packageMetadata.version)
        expect(RELEASES[0].version).toBe(APP_VERSION)
        expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/)
    })

    it('uses supported note categories and known application routes', () => {
        RELEASES.forEach((release) => {
            release.notes.forEach((note) => {
                expect(RELEASE_NOTE_TYPES).toContain(note.type)

                if (note.link) {
                    expect(workingRoutes.has(note.link.href)).toBe(true)
                    expect(note.link.label.trim().length).toBeGreaterThan(0)
                }
            })
        })
    })
})
