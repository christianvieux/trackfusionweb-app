'use client'

import Link from 'next/link'
import { ChevronsLeft, Heart, Home, ListTodo, Music } from 'lucide-react'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
    { label: 'Home', icon: Home, href: '/home' },
    { label: 'Feed', icon: ListTodo, href: '/feed' },
    { label: 'My Tracks', icon: Music, href: '/myTracks' },
    {
        label: 'My Favorite Tracks',
        icon: Heart,
        href: '/myFavoriteTracks',
    },
]

function SidebarLink({ item, isActive, isCollapsed }) {
    const Icon = item.icon

    return (
        <li>
            <Link
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                aria-label={isCollapsed ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
                className={`sidebar-nav-item ${isActive ? 'is-active' : ''} ${
                    isCollapsed ? 'is-collapsed' : ''
                }`}
            >
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                <span className={isCollapsed ? 'sr-only' : 'whitespace-nowrap'}>
                    {item.label}
                </span>
            </Link>
        </li>
    )
}

export default function Sidebar({
    className = '',
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
            className={`flex h-full min-h-0 flex-col overflow-x-hidden border-r border-accent/20 bg-background/70 px-2 py-3 backdrop-blur-lg backdrop-saturate-150 ${className}`}
            {...props}
        >
            <nav className="min-h-0 flex-1 overflow-y-auto">
                <ul className="space-y-1">
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

            {showCollapseToggle && (
                <button
                    type="button"
                    title={isCollapsed ? 'Expand sidebar' : undefined}
                    aria-label={
                        isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
                    }
                    aria-expanded={!isCollapsed}
                    onClick={onToggleCollapse}
                    className={`sidebar-collapse-toggle ${
                        isCollapsed ? 'is-collapsed' : ''
                    }`}
                >
                    <ChevronsLeft
                        aria-hidden="true"
                        className="size-5 shrink-0"
                    />
                    <span className={isCollapsed ? 'sr-only' : ''}>
                        Collapse
                    </span>
                </button>
            )}
        </aside>
    )
}
