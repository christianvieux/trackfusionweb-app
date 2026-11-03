// src/app/context/UserInfoContext.js
'use client'
import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
} from 'react'
import { fetchPublicUserInfo } from '../services/userService'
import { useSession } from './SessionContext'

const UserInfoContext = createContext({})

export const UserInfoProvider = ({ children }) => {
    const { user } = useSession()
    const userId = user?.id
    const [userInfo, setUserInfo] = useState(null)
    const value = useMemo(() => ({ userInfo, setUserInfo }), [userInfo])

    useEffect(() => {
        let isActive = true

        if (userId) {
            const fetchUserInfo = async function () {
                try {
                    const newUserInfo = await fetchPublicUserInfo(userId)
                    if (!isActive) return

                    setUserInfo(newUserInfo)
                } catch {
                    if (isActive) setUserInfo(null)
                }
            }
            fetchUserInfo()
        } else {
            setUserInfo({})
        }

        return () => {
            isActive = false
        }
    }, [userId])

    return (
        <UserInfoContext.Provider value={value}>
            {children}
        </UserInfoContext.Provider>
    )
}

export const useUserInfo = () => useContext(UserInfoContext)
