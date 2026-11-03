'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Home, ListTodo, Music } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

import Footer from './Footer'
import NavBar from './nav-bar'
import Sidebar from './Sidebar'

import AudioPlayer from './AudioPlayer/AudioPlayer'
import VideoBackground from './VideoBackground'

import { FavoriteTracksProvider } from '../context/FavoriteTracksContext'
import { PlaybackProvider, usePlayback } from '../context/PlaybackContext'
import { TrackListProvider } from '../context/TrackListContext'
import {
    TrackManagerProvider,
    useTrackManager,
} from '../context/TrackManagerContext'

/* -------------------- */
/* PROVIDERS */
/* -------------------- */

function AppProviders({ children }) {
    return (
        <FavoriteTracksProvider>
            <TrackListProvider>
                <TrackManagerProvider>
                    <PlaybackProvider>{children}</PlaybackProvider>
                </TrackManagerProvider>
            </TrackListProvider>
        </FavoriteTracksProvider>
    )
}

const MOBILE_NAV_ITEMS = [
    { label: 'Home', icon: Home, href: '/home' },
    { label: 'Feed', icon: ListTodo, href: '/feed' },
    { label: 'My Tracks', icon: Music, href: '/myTracks' },
    { label: 'Favorites', icon: Heart, href: '/myFavoriteTracks' },
]

function MobileTabBar() {
    const pathname = usePathname()

    return (
        <nav className="mobile-tab-bar" aria-label="Mobile navigation">
            {MOBILE_NAV_ITEMS.map(({ label, icon: Icon, href }) => {
                const isActive = pathname.toLowerCase() === href.toLowerCase()

                return (
                    <Link
                        key={href}
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        className={`mobile-tab-link ${isActive ? 'is-active' : ''}`}
                    >
                        <Icon className="size-5" aria-hidden="true" />
                        <span>{label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}

/* -------------------- */
/* APP LAYOUT */
/* -------------------- */

function AppShell({ children }) {
    const pathname = usePathname()
    const { currentTrack } = useTrackManager()
    const { canShowPlayback } = usePlayback()
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const showPlayer = canShowPlayback && Boolean(currentTrack)

    return (
        <div
            id="App"
            data-dock="right"
            data-has-player={showPlayer ? 'true' : 'false'}
            data-sidebar-collapsed={isSidebarCollapsed ? 'true' : 'false'}
            className="app-shell relative isolate h-dvh min-h-0 overflow-hidden text-foreground"
        >
            <VideoBackground playVideo={pathname === '/home'} />

            <Toaster position="bottom-center" />

            <Sidebar
                className="app-sidebar"
                isCollapsed={isSidebarCollapsed}
                showCollapseToggle
                onToggleCollapse={() =>
                    setIsSidebarCollapsed((current) => !current)
                }
            />

            <NavBar className="app-topbar" />

            <main id="Full_Content" className="app-main">
                <section
                    id="content"
                    className="flex min-h-0 min-w-0 flex-1 flex-col items-center overflow-auto p-3 *:max-w-full sm:p-4"
                >
                    {children}
                </section>

                <footer
                    id="Bottom_Content"
                    className="flex shrink-0 flex-col items-center"
                >
                    <Footer />
                </footer>
            </main>

            {showPlayer && <AudioPlayer />}

            <MobileTabBar />
        </div>
    )
}

export default function App({ children }) {
    return (
        <AppProviders>
            <AppShell>{children}</AppShell>
        </AppProviders>
    )
}
