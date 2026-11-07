import packageMetadata from '../../../package.json'

export const APP_VERSION = packageMetadata.version

export const RELEASE_NOTE_TYPES = ['added', 'improved', 'fixed']

export const RELEASES = [
    {
        version: APP_VERSION,
        date: '2026-11-06',
        title: 'Versioning and helpful guides',
        highlight: true,
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
