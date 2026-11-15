'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import FeedbackDialog from './FeedbackDialog'

const footerLinks = [
    { label: 'Home', href: '/home' },
    { label: 'About', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Contact', href: '/contact' },
]

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    return (
        <footer className="flex flex-col items-center justify-center gap-2 py-1 text-xs">
            <hr className="w-3/4 opacity-30" />

            <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                <p className="text-green-light">
                    &copy; {currentYear} Christian V. All rights reserved.
                </p>

                <ul className="flex flex-wrap justify-center gap-4">
                    {footerLinks.map(({ label, href }) => (
                        <li key={href} className="hover:text-primary">
                            <Link className="text-green-light" href={href}>
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <button
                    type="button"
                    onClick={() => setIsFeedbackOpen(true)}
                    className="text-green-light underline-offset-2 hover:text-primary hover:underline"
                >
                    Report a problem / Send feedback
                </button>

            </div>

            <FeedbackDialog
                isOpen={isFeedbackOpen}
                onOpenChange={setIsFeedbackOpen}
            />
        </footer>
    )
}
