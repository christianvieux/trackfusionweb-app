'use client'

import { Dropdown, Label } from '@heroui/react'
import { BookOpenText } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useSession } from '../context/SessionContext'
import { useUserInfo } from '../context/UserInfoContext'
import { logoutUser } from '../services/authService'
import useReleaseStatus from '../hooks/useReleaseStatus'

import GearIcon from './Icons/GearIcon'
import ProfileIcon from './Icons/ProfileIcon'
import UserIcon from './Icons/UserIcon'
import UserMinusIcon from './Icons/UserMinusIcon'
import UserAddIcon from './UserAddIcon'
import UserPill from './UserPill'
import { GUEST_IDENTITY } from '../avatar/constants'

export default function UserMenu({ className = '', ...props }) {
    const router = useRouter()
    const { user, setUser, loading } = useSession()
    const { userInfo, setUserInfo } = useUserInfo()
    const { hasUnreadRelease, markLatestReleaseViewed } = useReleaseStatus()

    const username =
        user?.username || (loading ? 'Loading…' : GUEST_IDENTITY.username)

    async function handleAction(key) {
        if (key === 'sign-in') router.push('/login')
        if (key === 'sign-up') router.push('/signup')
        if (key === 'profile') router.push(`/profile/${user.id}`)
        if (key === 'settings') router.push('/settings')
        if (key === 'whats-new') {
            markLatestReleaseViewed()
            router.push('/changelog')
        }

        if (key === 'logout') {
            try {
                const success = await logoutUser()
                if (!success) return

                setUser(null)
                setUserInfo(null)
                router.push('/home')
            } catch (error) {
                console.error('Failed to log out:', error)
            }
        }
    }

    return (
        <Dropdown {...props}>
            <Dropdown.Trigger
                aria-label="Open user menu"
                className={`flex cursor-pointer items-center gap-2 rounded-full p-2 text-foreground transition ${
                    className
                }`}
            >
                <UserPill
                    userInfo={userInfo}
                    userId={user?.id}
                    username={username}
                    isGuest={!loading && !user}
                    isLoading={loading}
                    animate={!loading}
                    classNames={{
                        UserAvatar: 'size-7',
                        Username: 'topbar-account-name text-sm sm:text-base',
                    }}
                />
            </Dropdown.Trigger>

            <Dropdown.Popover className="rounded-2xl border border-accent bg-surface p-2 shadow-card">
                <Dropdown.Menu
                    aria-label="User menu"
                    onAction={handleAction}
                    className="min-w-48"
                >
                    <Dropdown.Item
                        id="whats-new"
                        textValue="What's New"
                        className="text-foreground hover:text-primary!"
                    >
                        <div className="flex items-center gap-3 rounded-lg px-2 py-1">
                            <BookOpenText aria-hidden="true" className="size-5" />
                            <Label className="text-inherit">What&apos;s New</Label>
                            {hasUnreadRelease && (
                                <span
                                    aria-label="New release notes"
                                    className="ml-auto size-2 rounded-full bg-success"
                                />
                            )}
                        </div>
                    </Dropdown.Item>

                    {!user && (
                        <>
                            <Dropdown.Item
                                id="sign-in"
                                textValue="Sign in"
                                className="text-foreground hover:text-primary!"
                            >
                                <div className="flex items-center gap-3 rounded-lg px-2 py-1">
                                    <UserIcon />
                                    <Label className="text-inherit">
                                        Sign in
                                    </Label>
                                </div>
                            </Dropdown.Item>

                            <Dropdown.Item
                                id="sign-up"
                                textValue="Create Account"
                                className="text-foreground hover:text-primary!"
                            >
                                <div className="flex items-center gap-3 rounded-lg px-2 py-1">
                                    <UserAddIcon />
                                    <Label className="text-inherit">
                                        Create Account
                                    </Label>
                                </div>
                            </Dropdown.Item>
                        </>
                    )}

                    {user && (
                        <>
                            <Dropdown.Item
                                id="profile"
                                textValue="View Profile"
                                className="text-foreground hover:text-primary!"
                            >
                                <div className="flex items-center gap-3 rounded-lg px-2 py-1">
                                    <ProfileIcon />
                                    <Label className="text-inherit">
                                        View Profile
                                    </Label>
                                </div>
                            </Dropdown.Item>

                            <Dropdown.Item
                                id="settings"
                                textValue="Account Settings"
                                className="text-foreground hover:text-primary!"
                            >
                                <div className="flex items-center gap-3 rounded-lg px-2 py-1">
                                    <GearIcon />
                                    <Label className="text-inherit">
                                        Account Settings
                                    </Label>
                                </div>
                            </Dropdown.Item>

                            <Dropdown.Item
                                id="logout"
                                textValue="Log Out"
                                variant="danger"
                                className="text-danger hover:text-danger data-[hover=true]:text-danger"
                            >
                                <div className="flex items-center gap-3 rounded-lg px-2 py-1 text-danger">
                                    <UserMinusIcon />
                                    <Label className="text-inherit">
                                        Log Out
                                    </Label>
                                </div>
                            </Dropdown.Item>
                        </>
                    )}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    )
}
