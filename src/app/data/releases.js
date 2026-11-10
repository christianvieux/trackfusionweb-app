import packageMetadata from '../../../package.json'

export const APP_VERSION = packageMetadata.version

export const RELEASE_NOTE_TYPES = ['added', 'improved', 'fixed']

export const RELEASES = [
    {
        version: APP_VERSION,
        date: '2026-11-10',
        title: 'A smoother listening experience',
        highlight: true,
        notes: [
            {
                type: 'improved',
                text: 'Browse a cleaner Feed with better track artwork and layouts on smaller screens.',
                link: {
                    label: 'Explore the Feed',
                    href: '/feed',
                },
            },
            {
                type: 'improved',
                text: 'Keep your Feed search, filters, and view preferences while navigating and using browser Back.',
            },
            {
                type: 'fixed',
                text: 'Mobile player controls now avoid volume and queue drag actions unsupported by the browser.',
            },
            {
                type: 'improved',
                text: 'Enjoy lighter home page animations and clearer explanations of available features.',
            },
            {
                type: 'fixed',
                text: 'The guest avatar and release navigation are cleaner and better aligned.',
            },
        ],
    },
    {
        version: '1.0.0',
        date: '2026-11-06',
        title: 'Versioning and helpful guides',
        highlight: false,
        notes: [
            {
                type: 'added',
                text: 'Read concise release notes from the version badge or the full changelog.',
                link: {
                    label: 'View changelog',
                    href: '/changelog',
                },
            },
            {
                type: 'added',
                text: 'Follow practical steps for creating an account, uploading, listening, and managing tracks.',
                link: {
                    label: 'View guide',
                    href: '/how-it-works',
                },
            },
            {
                type: 'improved',
                text: 'The home page now gives you a clear path to more detailed help.',
            },
        ],
    },
]

export const LATEST_RELEASE = RELEASES[0]

export function formatReleaseVersion(version) {
    return `v${version}`
}

export function formatReleaseDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`))
}
