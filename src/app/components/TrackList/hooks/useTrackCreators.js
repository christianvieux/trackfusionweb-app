'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { fetchPublicUserInfo } from '../../../services/userService'

function getCreatorKey(userId) {
    return userId == null ? null : String(userId)
}

export function getEmbeddedTrackCreators(tracks = []) {
    return Object.fromEntries(
        tracks.flatMap((track) => {
            const creatorId = getCreatorKey(
                track?.creator?.id ?? track?.creator_id
            )
            return creatorId && track?.creator && typeof track.creator === 'object'
                ? [[creatorId, track.creator]]
                : []
        })
    )
}

const creatorCache = new Map()
const creatorRequests = new Map()

function loadCreator(creatorId) {
    if (creatorCache.has(creatorId)) {
        return Promise.resolve(creatorCache.get(creatorId))
    }

    if (!creatorRequests.has(creatorId)) {
        const request = fetchPublicUserInfo(creatorId)
            .then((creator) => {
                creatorCache.set(creatorId, creator)
                return creator
            })
            .finally(() => creatorRequests.delete(creatorId))

        creatorRequests.set(creatorId, request)
    }

    return creatorRequests.get(creatorId)
}

export default function useTrackCreators(tracks = []) {
    const [creatorsById, setCreatorsById] = useState({})
    const isMounted = useRef(true)
    const embeddedCreators = useMemo(
        () => getEmbeddedTrackCreators(tracks),
        [tracks]
    )
    const availableCreators = useMemo(
        () => ({ ...creatorsById, ...embeddedCreators }),
        [creatorsById, embeddedCreators]
    )

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
        ].filter((creatorId) => !availableCreators[creatorId])

        if (creatorIds.length === 0) return

        Promise.allSettled(
            creatorIds.map(async (creatorId) => {
                const creator = await loadCreator(creatorId)
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
    }, [availableCreators, tracks])

    return availableCreators
}
