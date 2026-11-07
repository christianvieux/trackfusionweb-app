'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Activity, Plus } from 'lucide-react'

import TrackFusionWebIcon from './Icons/TrackFusionWebIcon'
import ReleaseBadge from './Releases/ReleaseBadge'
import UploadIcon from './Icons/UploadIcon'
import UserMenu from './UserMenu'

const CREATE_LINKS = [
    { label: 'Upload a track', href: '/upload', icon: UploadIcon },
    { label: 'Analyze a track', href: '/analyze', icon: Activity },
]

function CreateLink({
    href,
    icon: Icon,
    children,
    variant = 'ghost',
    onClick,
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`topbar-create-link topbar-create-link--${variant}`}
        >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            <span>{children}</span>
        </Link>
    )
}

export default function NavBar({ className = '', ...props }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const mobileMenuRef = useRef(null)

    useEffect(() => {
        if (!isMenuOpen) return undefined

        function handlePointerDown(event) {
            if (!mobileMenuRef.current?.contains(event.target)) {
                setIsMenuOpen(false)
            }
        }

        function handleKeyDown(event) {
            if (event.key === 'Escape') setIsMenuOpen(false)
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isMenuOpen])

    return (
        <header className={`topbar ${className}`} {...props}>
            <nav
                className="topbar-nav h-full min-h-14 w-full gap-3 px-3 sm:px-4"
                aria-label="Primary"
            >
                <div className="topbar-brand flex min-w-0 items-center gap-2">
                    <Link
                        href="/home"
                        aria-label="TrackFusionWeb home"
                        className="min-w-0 shrink"
                    >
                        <TrackFusionWebIcon className="topbar-logo h-5 max-w-[min(47vw,190px)] text-foreground sm:h-6" />
                    </Link>

                    <ReleaseBadge />
                </div>

                <div className="desktop-nav-links topbar-primary-actions items-center gap-2">
                    <CreateLink
                        href="/upload"
                        icon={UploadIcon}
                        variant="primary"
                    >
                        Upload a track
                    </CreateLink>
                    <CreateLink href="/analyze" icon={Activity}>
                        Analyze a track
                    </CreateLink>
                </div>

                <div className="topbar-account-actions flex shrink-0 items-center gap-2 sm:gap-3">
                    <div ref={mobileMenuRef} className="relative">
                        <button
                            type="button"
                            aria-label="Open create menu"
                            aria-haspopup="menu"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen((current) => !current)}
                            className={`compact-create-trigger ${isMenuOpen ? 'is-open' : ''}`}
                        >
                            <Plus aria-hidden="true" className="size-5" />
                        </button>

                        {isMenuOpen && (
                            <div
                                role="menu"
                                aria-label="Create"
                                className="create-links-popover"
                            >
                                {CREATE_LINKS.map(
                                    ({ label, href, icon: Icon }) => (
                                        <CreateLink
                                            key={href}
                                            href={href}
                                            icon={Icon}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {label}
                                        </CreateLink>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <UserMenu className="topbar-account-chip" />
                </div>
            </nav>
        </header>
    )
}
