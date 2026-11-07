'use client'

import { useCallback, useEffect, useState } from 'react'

import { LATEST_RELEASE } from '../data/releases'
import {
    initializeReleaseStatus,
    markReleaseViewed,
    RELEASE_VIEW_EVENT,
    RELEASE_VIEW_STORAGE_KEY,
} from '../utils/releaseStatus'

export default function useReleaseStatus() {
    const [hasUnreadRelease, setHasUnreadRelease] = useState(false)

    useEffect(() => {
        setHasUnreadRelease(
            initializeReleaseStatus(window.localStorage, LATEST_RELEASE)
        )

        function syncReleaseStatus() {
            setHasUnreadRelease(
                initializeReleaseStatus(window.localStorage, LATEST_RELEASE)
            )
        }

        function handleStorage(event) {
            if (event.key === RELEASE_VIEW_STORAGE_KEY) syncReleaseStatus()
        }

        window.addEventListener(RELEASE_VIEW_EVENT, syncReleaseStatus)
        window.addEventListener('storage', handleStorage)

        return () => {
            window.removeEventListener(RELEASE_VIEW_EVENT, syncReleaseStatus)
            window.removeEventListener('storage', handleStorage)
        }
    }, [])

    const markLatestReleaseViewed = useCallback(() => {
        markReleaseViewed(window.localStorage, LATEST_RELEASE.version)
        setHasUnreadRelease(false)
        window.dispatchEvent(new Event(RELEASE_VIEW_EVENT))
    }, [])

    return { hasUnreadRelease, markLatestReleaseViewed }
}
