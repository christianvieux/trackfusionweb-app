'use client'

import { useEffect, useState } from 'react'

import {
    PLAYER_LAYOUTS,
    PLAYER_LAYOUT_STORAGE_KEY,
    normalizePlayerLayout,
} from './playerLayout'

export default function usePlayerLayout() {
    const [layout, setLayout] = useState(PLAYER_LAYOUTS.STAGE)
    const [hasLoadedPreference, setHasLoadedPreference] = useState(false)

    useEffect(() => {
        setLayout(
            normalizePlayerLayout(
                window.localStorage.getItem(PLAYER_LAYOUT_STORAGE_KEY)
            )
        )
        setHasLoadedPreference(true)
    }, [])

    useEffect(() => {
        if (!hasLoadedPreference) return

        window.localStorage.setItem(
            PLAYER_LAYOUT_STORAGE_KEY,
            normalizePlayerLayout(layout)
        )
    }, [hasLoadedPreference, layout])

    return [layout, setLayout]
}
