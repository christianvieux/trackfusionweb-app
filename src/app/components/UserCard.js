'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { fetchPublicUserInfo } from '../services/userService'
import UserPill from './UserPill'

export default function UserCard({
    userId,
    className = '',
    UserPillProps = {},
    animate = false,
    onUserInfoLoaded,
    onPointerEnter,
    onPointerLeave,
    onFocus,
    onBlur,
    ...props
}) {
    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(Boolean(userId))
    const [isInteracting, setIsInteracting] = useState(false)

    useEffect(() => {
        let cancelled = false

        setUserInfo({})
        setLoading(Boolean(userId))

        if (!userId) return undefined

        async function loadUserInfo() {
            try {
                const response = await fetchPublicUserInfo(userId)

                if (cancelled) return

                setUserInfo(response)
                onUserInfoLoaded?.(response)
            } catch (error) {
                if (!cancelled) {
                    console.error('Error fetching user info:', userId, error)
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadUserInfo()

        return () => {
            cancelled = true
        }
    }, [onUserInfoLoaded, userId])

    const {
        animate: userPillAnimate,
        className: userPillClassName = '',
        ...restUserPillProps
    } = UserPillProps

    return (
        <Link
            id="user_card"
            href={userInfo.id ? `/profile/${userInfo.id}` : '#'}
            className={`size-full ${className}`}
            onPointerEnter={(event) => {
                setIsInteracting(true)
                onPointerEnter?.(event)
            }}
            onPointerLeave={(event) => {
                setIsInteracting(false)
                onPointerLeave?.(event)
            }}
            onFocus={(event) => {
                setIsInteracting(true)
                onFocus?.(event)
            }}
            onBlur={(event) => {
                setIsInteracting(false)
                onBlur?.(event)
            }}
            {...props}
        >
            <UserPill
                userInfo={userInfo}
                userId={userId}
                username={userInfo.username || 'New User'}
                isLoading={loading}
                animate={userPillAnimate ?? (animate || isInteracting)}
                className={`hover:text-green-light bg-black ${userPillClassName}`}
                {...restUserPillProps}
            />
        </Link>
    )
}
