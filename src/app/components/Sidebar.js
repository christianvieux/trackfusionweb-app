'use client'

import Link from 'next/link'
import {
    Heart,
    Home,
    ListTodo,
    Music,
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react'
import { usePathname } from 'next/navigation'

import TrackFusionWebIcon from './Icons/TrackFusionWebIcon'

/* -------------------- */
/* DATA                 */
/* -------------------- */

const NAV_ITEMS = [
    { label: 'Home', icon: Home, href: '/home' },
    { label: 'Feed', icon: ListTodo, href: '/feed' },
    { label: 'My Tracks', icon: Music, href: '/myTracks' },
    { label: 'My Favorite Tracks', icon: Heart, href: '/myFavoriteTracks' },
]

/* -------------------- */
/* SUBCOMPONENTS        */
/* -------------------- */

/** Horizontal rule with a centered label — used for section dividers */
function SectionLabel({ children }) {
    return (
        <div className="flex items-center gap-2 px-2">
            <p className="shrink-0 text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                {children}
            </p>
        </div>
    )
}

/** Single nav link — pill active state (A), purple icon tint when inactive (B) */
function SidebarLink({ item, isActive, isCollapsed }) {
    const Icon = item.icon

    return (
        <li>
            <Link
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex items-center rounded-lg py-2.5 text-sm font-medium transition-all ${
                    isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'
                } ${
                    isActive
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
            >
                <Icon
                    className={`size-5 shrink-0 transition-colors ${
                        isActive
                            ? 'text-primary'
                            : 'text-accent group-hover:text-foreground'
                    }`}
                />
                <span className={isCollapsed ? 'sr-only' : 'whitespace-nowrap'}>
                    {item.label}
                </span>

                {/* Active left-bar accent (from B) */}
                {isActive && !isCollapsed && (
                    <span className="ml-auto h-4 w-0.5 rounded-full bg-primary" />
                )}
            </Link>
        </li>
    )
}

/* -------------------- */
/* SIDEBAR              */
/* -------------------- */

export default function Sidebar({
    className = '',
    classNames = {},
    isCollapsed = false,
    onToggleCollapse,
    showCollapseToggle = false,
    ...props
}) {
    const pathname = usePathname()
    const isActive = (href) => pathname.toLowerCase() === href.toLowerCase()

    return (
        <aside
            id="sidebar"
            aria-label="Main navigation"
            className={`flex h-screen flex-col overflow-x-hidden overflow-y-auto border-r border-accent/20 bg-background/70 backdrop-blur-lg backdrop-saturate-150 transition-[width] duration-200 ${
                isCollapsed ? 'w-[4.25rem]' : 'w-60'
            } ${className}`}
            {...props}
        >
            {/* Logo */}
            <div
                className={`flex min-h-16 items-center ${
                    isCollapsed ? 'justify-center px-2' : 'gap-2 px-4'
                } ${classNames.logo || ''}`}
            >
                {!isCollapsed && (
                    <Link href="/home" className="min-w-0 flex-1">
                        <TrackFusionWebIcon className="h-6 max-w-full text-foreground" />
                    </Link>
                )}

                {showCollapseToggle && (
                    <button
                        type="button"
                        aria-label={
                            isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                        }
                        aria-expanded={!isCollapsed}
                        onClick={onToggleCollapse}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-primary transition hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-primary"
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen className="size-5" />
                        ) : (
                            <PanelLeftClose className="size-5" />
                        )}
                    </button>
                )}
            </div>

            {/* Nav */}
            <section
                className={`flex flex-col gap-3 pb-4 ${isCollapsed ? 'px-2' : 'px-3'}`}
            >
                {!isCollapsed && <SectionLabel>Quick Links</SectionLabel>}
                <nav>
                    <ul className="space-y-0.5">
                        {NAV_ITEMS.map((item) => (
                            <SidebarLink
                                key={item.href}
                                item={item}
                                isActive={isActive(item.href)}
                                isCollapsed={isCollapsed}
                            />
                        ))}
                    </ul>
                </nav>
            </section>

        </aside>
    )
}
