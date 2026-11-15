import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { RELEASES } from '../../data/releases'
import ReleaseAccordion from './ReleaseAccordion'
import ReleaseNotesList, { groupReleaseNotes } from './ReleaseNotesList'

describe('release presentation', () => {
    it('opens only the current version by default', () => {
        const markup = renderToStaticMarkup(
            createElement(ReleaseAccordion, {
                releases: RELEASES,
                name: 'release-test',
            })
        )

        expect(markup.match(/<details/g)).toHaveLength(3)
        expect(markup.match(/ open=""/g)).toHaveLength(1)
        expect(markup).toContain('id="release-1-1-0"')
        expect(markup).toContain('id="release-1-0-1"')
        expect(markup).toContain('id="release-1-0-0"')
        expect(markup).toContain('name="release-test"')
        expect(markup).toContain(
            'class="release-summary-preview">Music controls, forms, uploads, and feedback now work more smoothly across phones and desktops.'
        )
        expect(markup).toContain('Unreleased')
        expect(markup).not.toContain('class="release-summary"')
    })

    it('groups changes in New, Improved, Fixed order with area labels', () => {
        const notes = [...RELEASES[1].notes, ...RELEASES[0].notes]
        const groups = groupReleaseNotes(notes)
        const markup = renderToStaticMarkup(
            createElement(ReleaseNotesList, { notes })
        )

        expect(groups.map((group) => group.label)).toEqual([
            'New',
            'Improved',
            'Fixed',
        ])
        expect(markup).toContain('Whole site')
        expect(markup).toContain('Home page')
        expect(markup.indexOf('New')).toBeLessThan(markup.indexOf('Improved'))
        expect(markup.indexOf('Improved')).toBeLessThan(markup.indexOf('Fixed'))
    })
})
