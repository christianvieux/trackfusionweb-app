'use client'

import { useEffect, useRef, useState } from 'react'

import { fetchPublicUserInfo } from '../../../services/userService'

function getCreatorKey(userId) {
    return userId == null ? null : String(userId)
}

export default function useTrackCreators(tracks = []) {
    const [creatorsById, setCreatorsById] = useState({})
    const requestedCreatorIds = useRef(new Set())
    const isMounted = useRef(true)

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        const creatorIds = [
            ...new Set(
                tracks
                    .map((track) => getCreatorKey(track?.creator_id))
                    .filter(Boolean)
            ),
        ].filter((creatorId) => !requestedCreatorIds.current.has(creatorId))

        if (creatorIds.length === 0) return

        creatorIds.forEach((creatorId) => {
            requestedCreatorIds.current.add(creatorId)
        })

        Promise.allSettled(
            creatorIds.map(async (creatorId) => {
                const creator = await fetchPublicUserInfo(creatorId)
                return [creatorId, creator]
            })
        ).then((results) => {
            if (!isMounted.current) return

            const loadedCreators = Object.fromEntries(
                results.flatMap((result) =>
                    result.status === 'fulfilled' ? [result.value] : []
                )
            )

            if (Object.keys(loadedCreators).length === 0) return

            setCreatorsById((currentCreators) => ({
                ...currentCreators,
                ...loadedCreators,
            }))
        })
    }, [tracks])

    return creatorsById
}
