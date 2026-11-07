'use client'

import { useEffect } from 'react'

import useReleaseStatus from '../../hooks/useReleaseStatus'

export default function ReleaseViewMarker() {
    const { markLatestReleaseViewed } = useReleaseStatus()

    useEffect(() => {
        markLatestReleaseViewed()
    }, [markLatestReleaseViewed])

    return null
}
