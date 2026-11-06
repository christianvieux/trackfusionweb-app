'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Heart, Home, ListTodo, Music } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

import Footer from './Footer'
import NavBar from './nav-bar'
import Sidebar from './Sidebar'

import { PLAYER_LAYOUTS } from './AudioPlayer/playerLayout'
import usePlayerLayout from './AudioPlayer/usePlayerLayout'
import VideoBackground from './VideoBackground'

import { FavoriteTracksProvider } from '../context/FavoriteTracksContext'
import { PlaybackProvider, usePlayback } from '../context/PlaybackContext'
import { TrackListProvider } from '../context/TrackListContext'
import {
    TrackManagerProvider,
    useTrackManager,
} from '../context/TrackManagerContext'

const AudioPlayer = dynamic(() => import('./AudioPlayer/AudioPlayer'), {
    ssr: false,
})

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

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'trackfusionweb:sidebar-collapsed'

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
    const [hasLoadedSidebarPreference, setHasLoadedSidebarPreference] =
        useState(false)
    const [playerLayout, setPlayerLayout] = usePlayerLayout()
    const showPlayer = canShowPlayback && Boolean(currentTrack)

    useEffect(() => {
        try {
            setIsSidebarCollapsed(
                window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) ===
                    'true'
            )
        } catch {
            // The sidebar still works when storage is unavailable.
        } finally {
            setHasLoadedSidebarPreference(true)
        }
    }, [])

    useEffect(() => {
        if (!hasLoadedSidebarPreference) return

        try {
            window.localStorage.setItem(
                SIDEBAR_COLLAPSED_STORAGE_KEY,
                String(isSidebarCollapsed)
            )
        } catch {
            // Ignore unavailable or blocked local storage.
        }
    }, [hasLoadedSidebarPreference, isSidebarCollapsed])

    return (
        <div
            id="App"
            data-dock="right"
            data-has-player={showPlayer ? 'true' : 'false'}
            data-player-layout={playerLayout}
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

            {showPlayer && (
                <AudioPlayer
                    isCollapsed={playerLayout === PLAYER_LAYOUTS.COLLAPSED}
                    onCollapsedChange={(isCollapsed) =>
                        setPlayerLayout(
                            isCollapsed
                                ? PLAYER_LAYOUTS.COLLAPSED
                                : PLAYER_LAYOUTS.STAGE
                        )
                    }
                />
            )}

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
