import packageMetadata from '../../../package.json'

export const APP_VERSION = packageMetadata.version

export const RELEASE_NOTE_TYPES = ['new', 'improved', 'fixed']

export const RELEASES = [
    {
        version: APP_VERSION,
        status: 'unreleased',
        date: null,
        title: 'More confidence on every screen',
        summary:
            'Music controls, forms, uploads, and feedback now work more smoothly across phones and desktops.',
        highlight: true,
        notes: [
            {
                type: 'new',
                area: 'Feedback',
                text: 'You can report a problem or share an idea from the bottom of any page, with a clear confirmation when it is sent.',
            },
            {
                type: 'improved',
                area: 'Player',
                text: 'The progress bar is easier to use with a mouse or touch, and playback stays more consistent when working with the queue and Stage.',
            },
            {
                type: 'improved',
                area: 'Uploads',
                text: 'File requirements, cover previews, progress, and upload problems are clearer before and during submission.',
            },
            {
                type: 'improved',
                area: 'Forms',
                text: 'Buttons show when an action is still in progress and prevent accidental duplicate submissions.',
            },
            {
                type: 'fixed',
                area: 'Mobile',
                text: 'Contact details, analysis results, account pages, track details, and dialogs fit small screens more reliably.',
            },
        ],
    },
    {
        version: '1.0.1',
        date: '2026-11-10',
        title: 'A smoother listening experience',
        summary:
            'The Feed, player, and home page now feel smoother, especially on phones.',
        highlight: true,
        notes: [
            {
                type: 'improved',
                area: 'Feed',
                text: 'Track artwork is clearer, and Feed layouts fit phones and small screens more comfortably.',
                link: {
                    label: 'Open the Feed',
                    href: '/feed',
                },
            },
            {
                type: 'improved',
                area: 'Feed',
                text: 'Your search, filters, and layout return when you open a track and use Back.',
            },
            {
                type: 'fixed',
                area: 'Player',
                text: 'On phones, the player hides volume and drag controls that mobile browsers cannot support.',
            },
            {
                type: 'improved',
                area: 'Home page',
                text: 'The home page uses lighter animations and explains the available features more clearly.',
            },
            {
                type: 'fixed',
                area: 'site',
                text: "The guest avatar and What's New navigation now line up more cleanly.",
            },
        ],
    },
    {
        version: '1.0.0',
        date: '2026-11-06',
        title: 'Versioning and helpful guides',
        summary:
            'You can see what changed in each version and follow guides for common tasks.',
        highlight: false,
        notes: [
            {
                type: 'new',
                area: 'site',
                text: 'Open the version badge for short release notes or visit the full updates page.',
                link: {
                    label: 'View updates',
                    href: '/changelog',
                },
            },
            {
                type: 'new',
                area: 'Help',
                text: 'Step-by-step guides cover accounts, uploads, listening, and managing tracks.',
                link: {
                    label: 'View guide',
                    href: '/how-it-works',
                },
            },
            {
                type: 'improved',
                area: 'Home page',
                text: 'The home page now points directly to more detailed help.',
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
