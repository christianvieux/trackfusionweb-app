'use client'

import { useEffect, useRef } from 'react'

import { getEdgeScrollVelocity, getEdgeSize } from './scrollUtils'

export default function ScrollableContainer({
    children,
    canScroll = true,
    className = '',
    ...props
}) {
    const containerRef = useRef(null)
    const pointerRef = useRef(null)
    const frameRef = useRef(null)
    const canScrollRef = useRef(Boolean(canScroll))

    useEffect(() => {
        canScrollRef.current = Boolean(canScroll)

        if (!canScroll && frameRef.current) {
            cancelAnimationFrame(frameRef.current)
            frameRef.current = null
        }
    }, [canScroll])

    useEffect(() => {
        function scrollFrame() {
            const container = containerRef.current
            const pointer = pointerRef.current

            if (!container || !pointer || !canScrollRef.current) {
                frameRef.current = null
                return
            }

            const rect = container.getBoundingClientRect()
            const verticalEdge = getEdgeSize(rect.height)
            const horizontalEdge = getEdgeSize(rect.width)
            const withinHorizontalReach =
                pointer.x >= rect.left - horizontalEdge &&
                pointer.x <= rect.right + horizontalEdge
            const withinVerticalReach =
                pointer.y >= rect.top - verticalEdge &&
                pointer.y <= rect.bottom + verticalEdge

            const deltaY =
                withinHorizontalReach &&
                container.scrollHeight > container.clientHeight
                    ? getEdgeScrollVelocity({
                          pointer: pointer.y,
                          start: rect.top,
                          end: rect.bottom,
                          edgeSize: verticalEdge,
                      })
                    : 0
            const deltaX =
                withinVerticalReach &&
                container.scrollWidth > container.clientWidth
                    ? getEdgeScrollVelocity({
                          pointer: pointer.x,
                          start: rect.left,
                          end: rect.right,
                          edgeSize: horizontalEdge,
                      })
                    : 0

            if (deltaX || deltaY) {
                container.scrollBy(deltaX, deltaY)
            }

            frameRef.current = requestAnimationFrame(scrollFrame)
        }

        function handlePointerMove(event) {
            pointerRef.current = { x: event.clientX, y: event.clientY }

            if (canScrollRef.current && !frameRef.current) {
                frameRef.current = requestAnimationFrame(scrollFrame)
            }
        }

        document.addEventListener('pointermove', handlePointerMove)

        return () => {
            document.removeEventListener('pointermove', handlePointerMove)

            if (frameRef.current) cancelAnimationFrame(frameRef.current)
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className={`max-h-full max-w-full overflow-auto ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}
