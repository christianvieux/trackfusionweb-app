import { describe, expect, it } from 'vitest'

import { DEVELOPMENT_HISTORY } from './developmentHistory'

const milestones = DEVELOPMENT_HISTORY.flatMap((group) => group.milestones)

describe('development history', () => {
    it('keeps milestones in reverse chronological order', () => {
        const dates = milestones.map((milestone) => milestone.date)

        expect(dates).toEqual([...dates].sort().reverse())
    })

    it('distinguishes the verified public release from development work', () => {
        const releases = milestones.filter(
            (milestone) => milestone.kind === 'release'
        )

        expect(releases).toEqual([
            expect.objectContaining({
                date: '2026-11-06',
                title: 'v1.0.0 public release baseline',
            }),
        ])
        expect(
            milestones.every((milestone) =>
                ['development', 'release'].includes(milestone.kind)
            )
        ).toBe(true)
    })

    it('uses public GitHub sources without private documentation links', () => {
        const sourceUrls = milestones.flatMap((milestone) =>
            milestone.sources.map((source) => source.href)
        )

        expect(sourceUrls.length).toBeGreaterThan(0)
        expect(
            sourceUrls.every((url) =>
                /^https:\/\/github\.com\/christianvieux\/trackfusionweb-(app|api)\//.test(
                    url
                )
            )
        ).toBe(true)
        expect(sourceUrls.join(' ')).not.toMatch(/handbook|private/i)
    })
})
