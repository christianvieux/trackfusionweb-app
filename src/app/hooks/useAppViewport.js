'use client'

import { useEffect } from 'react'

// The keyboard can resize only the visual viewport on iOS. The shell needs its
// actual available height because the track browser owns a bounded scroll area.
export default function useAppViewport() {
    useEffect(() => {
        const viewport = window.visualViewport
        if (!viewport) return undefined

        const root = document.documentElement
        let availableHeight = viewport.height
        let frame

        function update() {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                // Leave pinch zoom to the browser; resizing the layout during
                // magnification would reflow the content the user is reading.
                if (Math.abs(viewport.scale - 1) > 0.01) return

                root.style.setProperty(
                    '--app-viewport-height',
                    `${viewport.height}px`
                )
                root.style.setProperty(
                    '--app-viewport-offset-top',
                    `${viewport.offsetTop}px`
                )

                const focused = document.activeElement
                const isTextEntry = focused?.matches(
                    'input, textarea, select, [contenteditable="true"]'
                )
                if (!isTextEntry) availableHeight = viewport.height
                root.dataset.appKeyboardOpen = String(
                    Boolean(
                        isTextEntry && viewport.height < availableHeight - 80
                    )
                )

                if (isTextEntry && !focused.closest('[role="dialog"]')) {
                    // Scroll only the owning content viewport, never the page
                    // or every ancestor (which can pan the iOS layout viewport).
                    const shell = focused.closest('.app-shell')
                    const scroller =
                        shell?.dataset.contentFlow === 'bounded'
                            ? focused.closest('.app-content')
                            : focused.closest('.app-main')
                    if (!scroller) return
                    const field = focused.getBoundingClientRect()
                    const area = scroller.getBoundingClientRect()
                    if (field.bottom > area.bottom - 16) {
                        scroller.scrollTop += field.bottom - area.bottom + 16
                    } else if (field.top < area.top + 16) {
                        scroller.scrollTop -= area.top + 16 - field.top
                    }
                }
            })
        }

        update()
        viewport.addEventListener('resize', update)
        viewport.addEventListener('scroll', update)
        document.addEventListener('focusin', update)
        document.addEventListener('focusout', update)
        return () => {
            cancelAnimationFrame(frame)
            viewport.removeEventListener('resize', update)
            viewport.removeEventListener('scroll', update)
            document.removeEventListener('focusin', update)
            document.removeEventListener('focusout', update)
            root.style.removeProperty('--app-viewport-height')
            root.style.removeProperty('--app-viewport-offset-top')
            delete root.dataset.appKeyboardOpen
        }
    }, [])
}
