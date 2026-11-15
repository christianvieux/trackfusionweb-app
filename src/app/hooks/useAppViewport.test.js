import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEffect } from 'react'
import useAppViewport from './useAppViewport'

vi.mock('react', () => ({ useEffect: vi.fn() }))

describe('application visual viewport', () => {
    let viewport, style, focused, scroller, frame, cleanup

    beforeEach(() => {
        viewport = Object.assign(new EventTarget(), {
            height: 844,
            offsetTop: 0,
            scale: 1,
        })
        style = { setProperty: vi.fn(), removeProperty: vi.fn() }
        scroller = {
            scrollTop: 0,
            getBoundingClientRect: () => ({ top: 56, bottom: 360 }),
        }
        focused = {
            matches: () => true,
            closest: (selector) => {
                if (selector === '.app-shell') {
                    return { dataset: { contentFlow: 'bounded' } }
                }
                return selector === '.app-content' ? scroller : null
            },
            getBoundingClientRect: () => ({ top: 500, bottom: 540 }),
        }
        vi.stubGlobal('window', { visualViewport: viewport })
        vi.stubGlobal(
            'document',
            Object.assign(new EventTarget(), {
                documentElement: { style, dataset: {} },
                activeElement: focused,
            })
        )
        vi.stubGlobal('requestAnimationFrame', (callback) => {
            frame = callback
            return 1
        })
        vi.stubGlobal('cancelAnimationFrame', vi.fn())
        useEffect.mockImplementation((effect) => {
            cleanup = effect()
        })
    })

    afterEach(() => {
        cleanup?.()
        vi.unstubAllGlobals()
        vi.clearAllMocks()
    })

    it('shrinks and restores the shell with the visible viewport', () => {
        useAppViewport()
        frame()
        viewport.height = 420
        viewport.dispatchEvent(new Event('resize'))
        frame()
        expect(document.documentElement.dataset.appKeyboardOpen).toBe('true')
        expect(style.setProperty).toHaveBeenCalledWith(
            '--app-viewport-height',
            '420px'
        )
        viewport.height = 844
        viewport.dispatchEvent(new Event('resize'))
        frame()
        expect(document.documentElement.dataset.appKeyboardOpen).toBe('false')
        expect(style.setProperty).toHaveBeenCalledWith(
            '--app-viewport-height',
            '844px'
        )
    })

    it('keeps the shell aligned when iOS pans the visual viewport', () => {
        useAppViewport()
        frame()
        viewport.offsetTop = 118
        viewport.dispatchEvent(new Event('scroll'))
        frame()
        expect(style.setProperty).toHaveBeenLastCalledWith(
            '--app-viewport-offset-top',
            '118px'
        )
    })

    it('reveals a focused field within the owning scroll area', () => {
        useAppViewport()
        frame()
        expect(scroller.scrollTop).toBe(196)
        focused.getBoundingClientRect = () => ({ top: 30, bottom: 70 })
        viewport.dispatchEvent(new Event('resize'))
        frame()
        expect(scroller.scrollTop).toBe(154)
    })

    it('uses the main scroll region for natural-flow pages', () => {
        focused.closest = (selector) => {
            if (selector === '.app-shell') {
                return { dataset: { contentFlow: 'natural' } }
            }
            return selector === '.app-main' ? scroller : null
        }
        useAppViewport()
        frame()
        expect(scroller.scrollTop).toBe(196)
    })

    it('does not reflow or scroll during pinch zoom', () => {
        viewport.scale = 2
        useAppViewport()
        frame()
        expect(style.setProperty).not.toHaveBeenCalled()
        expect(scroller.scrollTop).toBe(0)
    })

    it('leaves dialog scrolling to the overlay library', () => {
        focused.closest = () => ({})
        useAppViewport()
        frame()
        expect(scroller.scrollTop).toBe(0)
    })

    it('uses the CSS fallback when the API is unavailable', () => {
        window.visualViewport = null
        useAppViewport()
        expect(cleanup).toBeUndefined()
        expect(style.setProperty).not.toHaveBeenCalled()
    })

    it('removes the viewport listener and pending frame on unmount', () => {
        const remove = vi.spyOn(viewport, 'removeEventListener')
        useAppViewport()
        cleanup()
        expect(remove).toHaveBeenCalledWith('resize', expect.any(Function))
        expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
        expect(cancelAnimationFrame).toHaveBeenCalledWith(1)
        expect(style.removeProperty).toHaveBeenCalledWith(
            '--app-viewport-height'
        )
        expect(style.removeProperty).toHaveBeenCalledWith(
            '--app-viewport-offset-top'
        )
        expect(document.documentElement.dataset.appKeyboardOpen).toBeUndefined()
        cleanup = undefined
    })
})
