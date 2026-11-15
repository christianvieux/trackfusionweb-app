import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import ProgressSlider from './ProgressSlider'

describe('ProgressSlider', () => {
    it('renders one shared, accessible seek control with playback time', () => {
        const markup = renderToStaticMarkup(
            React.createElement(ProgressSlider, {
                progress: 0.5,
                duration: 120,
                onSeek: vi.fn(),
                className: 'progress-test',
            })
        )

        expect(markup).toContain('progress-test')
        expect(markup).toContain('stage-progress-slider-track')
        expect(markup).toContain('type="range"')
        expect(markup).toContain('aria-valuetext="60 seconds"')
    })
})
