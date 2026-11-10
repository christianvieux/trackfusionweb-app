const APP_REPOSITORY = 'https://github.com/christianvieux/trackfusionweb-app'
const API_REPOSITORY = 'https://github.com/christianvieux/trackfusionweb-api'

export const DEVELOPMENT_HISTORY = [
    {
        period: 'November 2026',
        milestones: [
            {
                date: '2026-11-09',
                dateLabel: 'November 9–10',
                kind: 'development',
                title: 'Final listening and navigation polish',
                description:
                    "The Feed gained more reliable artwork and small-screen layouts, navigation state moved into shareable URLs, mobile playback controls became browser-aware, and the home page shed duplicate animation work. These changes are summarized in What's New; this entry records their development, not a separate public release.",
                sources: [
                    {
                        label: 'Artwork and mobile layouts',
                        href: `${APP_REPOSITORY}/pull/19`,
                    },
                    {
                        label: 'Home page performance',
                        href: `${APP_REPOSITORY}/pull/22`,
                    },
                ],
            },
            {
                date: '2026-11-06',
                dateLabel: 'November 6',
                kind: 'release',
                title: 'v1.0.0 public release baseline',
                description:
                    "TrackFusionWeb established its first verified public release record with the version badge, What's New notes, a changelog, and practical help for accounts, uploads, listening, and track management.",
                sources: [
                    {
                        label: 'Release history and user help',
                        href: `${APP_REPOSITORY}/commit/8275180`,
                    },
                ],
            },
            {
                date: '2026-11-06',
                dateLabel: 'November 6',
                kind: 'development',
                title: 'Bounded data and lighter startup work',
                description:
                    'Public and personal track collections moved to numbered pages, uploaded artwork was normalized, playback code was deferred, and favorite data loaded only when needed. Queue retention was also bounded to keep background processing predictable.',
                sources: [
                    {
                        label: 'Paginated Feed',
                        href: `${APP_REPOSITORY}/commit/9709a89`,
                    },
                    {
                        label: 'Bounded API collections',
                        href: `${API_REPOSITORY}/commit/94be5d6`,
                    },
                ],
            },
            {
                date: '2026-11-03',
                dateLabel: 'November 3',
                kind: 'development',
                title: 'Responsive discovery, avatars, and shared playback',
                description:
                    'A major interface pass introduced persistent custom avatars, consistent artwork fallbacks, Rows, Tiles, and Spotlight browsing, responsive navigation, and a collapsible Stage player. Playback and the draggable queue continued to share one source of truth across desktop and mobile.',
                sources: [
                    {
                        label: 'Responsive track experience',
                        href: `${APP_REPOSITORY}/commit/b2fb94d`,
                    },
                    {
                        label: 'Persisted avatar selections',
                        href: `${API_REPOSITORY}/commit/c351904`,
                    },
                ],
            },
        ],
    },
    {
        period: 'October 2026',
        milestones: [
            {
                date: '2026-10-27',
                dateLabel: 'October 27–30',
                kind: 'development',
                title: 'Safer registration and repeatable local testing',
                description:
                    'Registration gained a secure, one-time handoff between email verification and account creation. Local development gained compatible object storage and captured email, while automated coverage exercised registration, media, retries, and production configuration safeguards.',
                sources: [
                    {
                        label: 'Registration workflow',
                        href: `${API_REPOSITORY}/commit/ec743a3`,
                    },
                    {
                        label: 'Local media workflow',
                        href: `${API_REPOSITORY}/commit/777a508`,
                    },
                ],
            },
            {
                date: '2026-10-24',
                dateLabel: 'October 24–26',
                kind: 'development',
                title: 'Full-stack production modernization',
                description:
                    'The API hardened account and media ownership, modernized BPM and musical-key analysis, and formalized its container, database, queue, private storage, and cloud infrastructure. Guarded deployment and recovery checks joined a frontend pass that centralized API calls, tightened uploads and sessions, and added automated lint, test, and production-build gates.',
                sources: [
                    {
                        label: 'API security boundaries',
                        href: `${API_REPOSITORY}/commit/db5ca94`,
                    },
                    {
                        label: 'Frontend quality gates',
                        href: `${APP_REPOSITORY}/commit/e00791a`,
                    },
                ],
            },
        ],
    },
    {
        period: 'April–May 2026',
        milestones: [
            {
                date: '2026-05-11',
                dateLabel: 'May 10–11',
                kind: 'development',
                title: 'The connected application returns to active development',
                description:
                    'A broad frontend refresh restored the evolving product on main with account settings, profiles, sharing, uploads, analysis, favorites, responsive pages, and a richer audio player. The API aligned sign-in cookies, browser access rules, health checks, and routes with the App.',
                sources: [
                    {
                        label: 'Frontend restoration',
                        href: `${APP_REPOSITORY}/commit/443beb4`,
                    },
                    {
                        label: 'Session and CORS alignment',
                        href: `${API_REPOSITORY}/commit/3b59020`,
                    },
                ],
            },
            {
                date: '2026-04-27',
                dateLabel: 'April 9–27',
                kind: 'development',
                title: 'Hosted App and API reconnect',
                description:
                    'Public project links returned and the API began validating browser origins dynamically, setting up the next full-stack development phase without claiming a new versioned release.',
                sources: [
                    {
                        label: 'Browser origin handling',
                        href: `${API_REPOSITORY}/commit/57d166d`,
                    },
                    {
                        label: 'Public project links',
                        href: `${APP_REPOSITORY}/commit/9e39837`,
                    },
                ],
            },
        ],
    },
    {
        period: 'June 2025',
        milestones: [
            {
                date: '2025-06-10',
                dateLabel: 'June 10–13',
                kind: 'development',
                title: 'Maintenance between major build phases',
                description:
                    'The paused project still received focused upkeep: the frontend framework was refreshed and the API changed transactional email providers. Git records no verified public release for this period.',
                sources: [
                    {
                        label: 'Frontend framework update',
                        href: `${APP_REPOSITORY}/commit/2e0ea28`,
                    },
                    {
                        label: 'Email service update',
                        href: `${API_REPOSITORY}/commit/3821854`,
                    },
                ],
            },
        ],
    },
    {
        period: 'February 2025',
        milestones: [
            {
                date: '2025-02-04',
                dateLabel: 'February 4',
                kind: 'development',
                title: 'Repository and hosting transition',
                description:
                    'The original frontend added a moved-site experience and was marked archived while deployment work shifted elsewhere. This was a development transition, not evidence of a public product release.',
                sources: [
                    {
                        label: 'Moved-site page',
                        href: `${APP_REPOSITORY}/commit/0d89802`,
                    },
                ],
            },
        ],
    },
    {
        period: 'January 2025',
        milestones: [
            {
                date: '2025-01-29',
                dateLabel: 'January 29–30',
                kind: 'development',
                title: 'Direct uploads and background media work',
                description:
                    'Uploads moved toward short-lived storage links with visible progress in the browser. The API added private object-storage services and worker queues for tracks and profile images, separating long-running media processing from web requests.',
                sources: [
                    {
                        label: 'Browser upload flow',
                        href: `${APP_REPOSITORY}/commit/1d3846f`,
                    },
                    {
                        label: 'Storage and worker queues',
                        href: `${API_REPOSITORY}/commit/05545e0`,
                    },
                ],
            },
            {
                date: '2025-01-06',
                dateLabel: 'January 6',
                kind: 'development',
                title: 'TrackFusionWeb begins as a full-stack music prototype',
                description:
                    'The first App and API commits already covered accounts and verification, track browsing, favorites, uploads, playback and queues, plus Python-backed BPM and musical-key analysis. The foundation combined a Next.js interface with an Express API and persistent track data.',
                sources: [
                    {
                        label: 'Initial App commit',
                        href: `${APP_REPOSITORY}/commit/5917706`,
                    },
                    {
                        label: 'Initial API commit',
                        href: `${API_REPOSITORY}/commit/c925d9d`,
                    },
                ],
            },
        ],
    },
]
