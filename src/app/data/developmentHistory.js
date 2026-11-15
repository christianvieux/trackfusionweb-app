const APP_REPOSITORY = 'https://github.com/christianvieux/trackfusionweb-app'
const API_REPOSITORY = 'https://github.com/christianvieux/trackfusionweb-api'

export const DEVELOPMENT_HISTORY = [
    {
        period: 'November 2026',
        milestones: [
            {
                date: '2026-11-10',
                kind: 'development',
                title: 'Polish for the Feed, player, and navigation',
                description:
                    'The Feed became easier to browse on small screens, Back returned people to their previous view, and phone playback controls became clearer. The home page also became lighter.',
                technical:
                    "The Feed gained more reliable artwork and small-screen layouts, navigation state moved into shareable URLs, mobile playback controls became browser-aware, and the home page shed duplicate animation work. These changes are summarized in What's New; this entry records their development, not a separate public release.",
                areas: ['Feed', 'Player', 'Home page', 'site'],
                includedIn: '1.0.1',
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
                kind: 'release',
                title: 'v1.0.0 verified versioned release baseline',
                description:
                    "This is the earliest release with a verified version number and date. It added What's New notes and practical help without marking the site's first public availability.",
                technical:
                    "TrackFusionWeb established its first verified public release record with the version badge, What's New notes, a changelog, and practical help for accounts, uploads, listening, and track management.",
                areas: ['site', 'Help'],
                sources: [
                    {
                        label: 'Release history and user help',
                        href: `${APP_REPOSITORY}/commit/8275180`,
                    },
                ],
            },
            {
                date: '2026-11-06',
                kind: 'development',
                title: 'Faster browsing for larger track libraries',
                description:
                    'The Feed and personal track lists began loading in smaller pages, while playback and favorites did less work up front. Background media jobs also kept less finished work around.',
                technical:
                    'Public and personal track collections moved to numbered pages, uploaded artwork was normalized, playback code was deferred, and favorite data loaded only when needed. Queue retention was also bounded to keep background processing predictable.',
                areas: ['Feed', 'Player', 'api'],
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
                kind: 'development',
                title: 'Responsive discovery, avatars, and shared playback',
                description:
                    'Custom avatars and three Feed layouts arrived alongside responsive navigation and a collapsible player. The same playback queue continued across desktop and phones.',
                technical:
                    'A major interface pass introduced persistent custom avatars, consistent artwork fallbacks, Rows, Tiles, and Spotlight browsing, responsive navigation, and a collapsible Stage player. Playback and the draggable queue continued to share one source of truth across desktop and mobile.',
                areas: ['Feed', 'Player', 'Profiles', 'site'],
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
                date: '2026-10-30',
                kind: 'development',
                title: 'Safer registration and repeatable local testing',
                description:
                    'Email verification handed off to account creation more safely, and local setups could test storage and email without production services. Automated checks covered retries and production safeguards.',
                technical:
                    'Registration gained a secure, one-time handoff between email verification and account creation. Local development gained compatible object storage and captured email, while automated coverage exercised registration, media, retries, and production configuration safeguards.',
                areas: ['Accounts', 'Uploads', 'api'],
                sources: [
                    {
                        label: 'Registration workflow',
                        href: `${API_REPOSITORY}/commit/ec743a3`,
                    },
                    {
                        label: 'Local media workflow',
                        href: `${API_REPOSITORY}/commit/777a508`,
                    },
                    {
                        label: 'Production security gates',
                        href: `${API_REPOSITORY}/commit/3aa2285`,
                    },
                ],
            },
            {
                date: '2026-10-26',
                kind: 'development',
                title: 'Production and quality foundations',
                description:
                    'Account and media ownership checks became stricter, audio analysis was refreshed, and deployment gained reviewed safety checks. The App also made uploads, sessions, and automated checks more consistent.',
                technical:
                    'The API hardened account and media ownership, modernized BPM and musical-key analysis, and formalized its container, database, queue, private storage, and cloud infrastructure. Guarded deployment and recovery checks joined a frontend pass that centralized API calls, tightened uploads and sessions, and added automated lint, test, and production-build gates.',
                areas: ['Accounts', 'Uploads', 'Analyze', 'api'],
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
        period: 'May 2026',
        milestones: [
            {
                date: '2026-05-11',
                kind: 'development',
                title: 'The connected application returns to active development',
                description:
                    'Account settings, profiles, sharing, uploads, analysis, favorites, responsive pages, and a fuller player returned together. Browser sign-in and API routing were aligned at the same time.',
                technical:
                    'A broad frontend refresh restored the evolving product on main with account settings, profiles, sharing, uploads, analysis, favorites, responsive pages, and a richer audio player. The API aligned sign-in cookies, browser access rules, health checks, and routes with the App.',
                areas: ['Accounts', 'Feed', 'Player', 'Uploads', 'api'],
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
        ],
    },
    {
        period: 'April 2026',
        milestones: [
            {
                date: '2026-04-27',
                kind: 'development',
                title: 'Hosted App and API reconnect',
                description:
                    'Public project links returned, and browser access rules began adapting to the hosted App more reliably. This prepared the next full-stack development phase without claiming a new release.',
                technical:
                    'Public project links returned and the API began validating browser origins dynamically, setting up the next full-stack development phase without claiming a new versioned release.',
                areas: ['site', 'api'],
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
                date: '2025-06-13',
                kind: 'development',
                title: 'Maintenance between major build phases',
                description:
                    'The paused project still received focused upkeep: the frontend framework was refreshed and account email moved to a different delivery service. No verified versioned release is recorded for this period.',
                technical:
                    'The paused project still received focused upkeep: the frontend framework was refreshed and the API changed transactional email providers. Git records no verified public release for this period.',
                areas: ['Accounts', 'site', 'api'],
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
                kind: 'development',
                title: 'Repository and hosting transition',
                description:
                    'The original frontend added a moved-site notice and was marked archived while hosting work shifted elsewhere. This records a development transition, not a new release.',
                technical:
                    'The original frontend added a moved-site experience and was marked archived while deployment work shifted elsewhere. This was a development transition, not evidence of a public product release.',
                areas: ['site'],
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
                date: '2025-01-30',
                kind: 'development',
                title: 'Direct uploads and background media work',
                description:
                    'Uploads gained visible progress and began sending files through short-lived storage links. Longer track and profile-image work moved away from ordinary page requests.',
                technical:
                    'Uploads moved toward short-lived storage links with visible progress in the browser. The API added private object-storage services and worker queues for tracks and profile images, separating long-running media processing from web requests.',
                areas: ['Uploads', 'Profiles', 'api'],
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
                kind: 'development',
                title: 'TrackFusionWeb begins as a full-stack music prototype',
                description:
                    'The first working foundation already covered accounts, tracks, favorites, uploads, playback, queues, and BPM and musical-key analysis. The browser App and server API were built together from the start.',
                technical:
                    'The first App and API commits already covered accounts and verification, track browsing, favorites, uploads, playback and queues, plus Python-backed BPM and musical-key analysis. The foundation combined a Next.js interface with an Express API and persistent track data.',
                areas: [
                    'Accounts',
                    'Feed',
                    'Player',
                    'Uploads',
                    'Analyze',
                    'api',
                ],
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
