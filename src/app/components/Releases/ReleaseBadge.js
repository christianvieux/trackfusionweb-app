'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

import {
    APP_VERSION,
    formatReleaseDate,
    formatReleaseVersion,
    LATEST_RELEASE,
} from '../../data/releases'
import useReleaseStatus from '../../hooks/useReleaseStatus'
import ReleaseNotesList from './ReleaseNotesList'

export default function ReleaseBadge() {
    const [isOpen, setIsOpen] = useState(false)
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 })
    const { hasUnreadRelease, markLatestReleaseViewed } = useReleaseStatus()
    const containerRef = useRef(null)
    const triggerRef = useRef(null)
    const closeRef = useRef(null)
    const cardRef = useRef(null)
    const titleId = useId()

    function closeCard({ restoreFocus = true } = {}) {
        setIsOpen(false)
        if (restoreFocus) {
            requestAnimationFrame(() => triggerRef.current?.focus())
        }
    }

    function toggleCard() {
        if (isOpen) {
            closeCard()
            return
        }

        markLatestReleaseViewed()
        const triggerBounds = triggerRef.current?.getBoundingClientRect()
        setCardPosition({
            top: (triggerBounds?.bottom || 0) + 10,
            left: triggerBounds?.left || 0,
        })
        setIsOpen(true)
    }

    useEffect(() => {
        if (!isOpen) return undefined

        closeRef.current?.focus()

        function handlePointerDown(event) {
            if (
                !containerRef.current?.contains(event.target) &&
                !cardRef.current?.contains(event.target)
            ) {
                closeCard({ restoreFocus: false })
            }
        }

        function handleKeyDown(event) {
            if (event.key === 'Escape') closeCard()
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)

        function updateCardPosition() {
            const triggerBounds = triggerRef.current?.getBoundingClientRect()
            setCardPosition({
                top: (triggerBounds?.bottom || 0) + 10,
                left: triggerBounds?.left || 0,
            })
        }

        window.addEventListener('resize', updateCardPosition)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('resize', updateCardPosition)
        }
    }, [isOpen])

    const versionLabel = formatReleaseVersion(APP_VERSION)
    const accessibleLabel = hasUnreadRelease
        ? `Version ${APP_VERSION}, new release notes`
        : `Version ${APP_VERSION}, open release notes`

    return (
        <div ref={containerRef} className="release-badge-container">
            <button
                ref={triggerRef}
                type="button"
                aria-label={accessibleLabel}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                onClick={toggleCard}
                className={`release-badge ${hasUnreadRelease ? 'is-new' : ''}`}
            >
                {hasUnreadRelease && (
                    <span className="release-badge-new">NEW</span>
                )}
                <span>{versionLabel}</span>
            </button>

            {isOpen &&
                createPortal(
                    <section
                        ref={cardRef}
                        role="dialog"
                        aria-modal="false"
                        aria-labelledby={titleId}
                        className="release-card"
                        style={{
                            '--release-card-top': `${cardPosition.top}px`,
                            '--release-card-left': `${cardPosition.left}px`,
                        }}
                    >
                        <div className="release-card-header">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.18em] text-success uppercase">
                                    What&apos;s new
                                </p>
                                <h2
                                    id={titleId}
                                    className="mt-1 text-lg font-semibold text-primary"
                                >
                                    {LATEST_RELEASE.title}
                                </h2>
                            </div>

                            <button
                                ref={closeRef}
                                type="button"
                                aria-label="Close release notes"
                                onClick={() => closeCard()}
                                className="release-card-close"
                            >
                                <X aria-hidden="true" className="size-4" />
                            </button>
                        </div>

                        <p className="mb-4 text-xs text-muted-foreground">
                            {formatReleaseVersion(LATEST_RELEASE.version)} ·{' '}
                            {formatReleaseDate(LATEST_RELEASE.date)}
                        </p>

                        <ReleaseNotesList
                            notes={LATEST_RELEASE.notes}
                            compact
                        />

                        <div className="release-card-footer">
                            <span>You&apos;re on {versionLabel}</span>
                            <Link
                                href="/changelog"
                                onClick={() =>
                                    closeCard({ restoreFocus: false })
                                }
                                className="font-semibold text-primary hover:text-primary-hover"
                            >
                                Full changelog
                            </Link>
                        </div>
                    </section>,
                    document.body
                )}
        </div>
    )
}
