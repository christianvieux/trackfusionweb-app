'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { Tag, X } from 'lucide-react'
import { createPortal } from 'react-dom'

import {
    APP_VERSION,
    formatReleaseVersion,
    RELEASES,
} from '../../data/releases'
import useReleaseStatus from '../../hooks/useReleaseStatus'
import ReleaseAccordion from './ReleaseAccordion'

function getCardPosition(trigger) {
    const triggerBounds = trigger?.getBoundingClientRect()
    const cardWidth = Math.min(380, window.innerWidth - 24)

    return {
        top: (triggerBounds?.bottom || 0) + 10,
        left: Math.min(
            Math.max(12, triggerBounds?.left || 12),
            window.innerWidth - cardWidth - 12
        ),
    }
}

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
        setCardPosition(getCardPosition(triggerRef.current))
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
            setCardPosition(getCardPosition(triggerRef.current))
        }

        window.addEventListener('resize', updateCardPosition)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('resize', updateCardPosition)
        }
    }, [isOpen])

    const versionLabel = formatReleaseVersion(APP_VERSION)
    const isUnreleased = RELEASES[0].status === 'unreleased'
    const accessibleLabel = isUnreleased
        ? `Upcoming version ${APP_VERSION}, open release notes`
        : hasUnreadRelease
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
                <Tag aria-hidden="true" className="size-3 shrink-0" />
                <span>{versionLabel}</span>
                {hasUnreadRelease && (
                    <span className="release-badge-new">NEW</span>
                )}
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
                                <p className="release-card-eyebrow">
                                    What&apos;s new
                                </p>
                                <h2 id={titleId} className="release-card-title">
                                    Updates to TrackFusionWeb
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

                        <ReleaseAccordion
                            releases={RELEASES.slice(0, 4)}
                            name="release-popover"
                            variant="popover"
                            idPrefix="popover-release"
                        />

                        <div className="release-card-footer">
                            <span>
                                {isUnreleased
                                    ? `${versionLabel} is coming next`
                                    : `You're on ${versionLabel}`}
                            </span>
                            <Link
                                href="/changelog"
                                onClick={() =>
                                    closeCard({ restoreFocus: false })
                                }
                                className="font-semibold text-primary hover:text-primary-hover"
                            >
                                All updates
                                <span aria-hidden="true"> →</span>
                            </Link>
                        </div>
                    </section>,
                    document.body
                )}
        </div>
    )
}
