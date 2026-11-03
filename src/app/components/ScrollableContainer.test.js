import { describe, expect, it } from 'vitest'

import { getEdgeScrollVelocity } from './scrollUtils'

const bounds = { start: 100, end: 500, edgeSize: 80, maxSpeed: 20 }

describe('edge auto-scroll velocity', () => {
    it('stays still away from the activation zones', () => {
        expect(getEdgeScrollVelocity({ ...bounds, pointer: 300 })).toBe(0)
    })

    it('scrolls toward the nearest edge', () => {
        expect(getEdgeScrollVelocity({ ...bounds, pointer: 120 })).toBeLessThan(
            0
        )
        expect(
            getEdgeScrollVelocity({ ...bounds, pointer: 480 })
        ).toBeGreaterThan(0)
    })

    it('accelerates as the pointer moves farther beyond an edge', () => {
        const nearBottom = getEdgeScrollVelocity({ ...bounds, pointer: 490 })
        const beyondBottom = getEdgeScrollVelocity({ ...bounds, pointer: 550 })

        expect(beyondBottom).toBeGreaterThan(nearBottom)
        expect(beyondBottom).toBeLessThanOrEqual(50)
    })
})
