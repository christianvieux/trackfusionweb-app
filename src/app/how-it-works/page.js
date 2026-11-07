import Link from 'next/link'
import {
    Headphones,
    Heart,
    ListMusic,
    Search,
    Upload,
    UserPlus,
} from 'lucide-react'

import { StaticPageShell } from '../components/StaticPage'

export const metadata = {
    title: 'How It Works',
    description:
        'Learn how to create an account, upload, discover, play, save, and manage tracks on TrackFusionWeb.',
}

const journeys = [
    {
        title: 'Create your account',
        icon: UserPlus,
        steps: [
            'Open Create Account and enter your email address.',
            'Enter the six-digit verification code sent to your email.',
            'Choose a username and password, accept the terms, and select Register.',
        ],
        tip: 'If the code does not arrive, use Resend Code after the short wait shown on the page.',
        action: { label: 'Create an account', href: '/signup' },
    },
    {
        title: 'Upload audio',
        icon: Upload,
        steps: [
            'Sign in and choose Upload a track from the top bar.',
            'Select your audio file. You can also add a cover image.',
            'Check the track name, add any helpful details, and choose the category, genre, and mood.',
            'Turn on Public Track if you want other people to find it, then select Submit.',
        ],
        tip: 'New uploads are private unless you turn on Public Track. After the upload finishes, the track appears under My Tracks.',
        action: { label: 'Upload a track', href: '/upload' },
    },
    {
        title: 'Find and listen to tracks',
        icon: Search,
        steps: [
            'Open Feed to browse public tracks.',
            'Use search and the available filters to narrow the list.',
            'Select a play button to start listening. Open a track or creator from its options menu when you want more detail.',
        ],
        tip: 'Example: search for a title, then select a genre or mood to focus the results.',
        action: { label: 'Explore tracks', href: '/feed' },
    },
    {
        title: 'Use the player and queue',
        icon: Headphones,
        steps: [
            'Start any track to open the player.',
            'Use the timeline and volume controls while listening. Previous, next, repeat, and shuffle are available in the full player.',
            'Choose Add to queue from a track menu. Open the queue to play, reorder, or remove upcoming tracks.',
        ],
        tip: 'The compact phone player keeps the current track close while you move between pages.',
    },
    {
        title: 'Save favorites',
        icon: Heart,
        steps: [
            'Sign in and select the heart on a track or choose Favorite from its options menu.',
            'Open Favorites from the navigation to see everything you saved.',
            'Select the heart again when you want to remove a track from Favorites.',
        ],
        tip: 'Your saved favorites belong to your account, so you need to be signed in to change them.',
        action: { label: 'View favorites', href: '/myFavoriteTracks' },
    },
    {
        title: 'Manage your tracks',
        icon: ListMusic,
        steps: [
            'Open My Tracks to see audio you uploaded.',
            'Open a track’s options and choose Configure this track.',
            'Change its name, description, or public setting, then save. You can also delete the track after confirming your choice.',
        ],
        tip: 'Only the person who uploaded a track sees its configuration option.',
        action: { label: 'Open My Tracks', href: '/myTracks' },
    },
]

const faqs = [
    {
        question: 'Why did I not receive an account verification code?',
        answer: 'Check that the email address is correct and look in your spam folder. If the page shows a waiting period, let it finish and then use Resend Code. Registration may also be temporarily unavailable; the sign-up page will say so when that happens.',
    },
    {
        question: 'Why can’t I open the upload page?',
        answer: 'Uploads require an account. Sign in first, then choose Upload a track from the top bar.',
    },
    {
        question: 'Why can’t other people find my uploaded track?',
        answer: 'Tracks are private by default during upload. Open the track’s options, choose Configure this track, and turn on Public Track if you want it to appear to other users.',
    },
    {
        question: 'Why does a track not start playing?',
        answer: 'Try the play button again and check your device volume and internet connection. If one track still does not play, try another track to see whether the problem is limited to that upload.',
    },
    {
        question: 'Where did my favorite tracks go?',
        answer: 'Make sure you are signed in to the same account you used when saving them. Then open Favorites from the navigation. A newly saved favorite can take a moment to finish updating.',
    },
]

export default function HowItWorksPage() {
    return (
        <StaticPageShell title="How TrackFusionWeb Works">
            <div className="max-w-3xl space-y-3 text-sm leading-6 sm:text-base">
                <p>
                    TrackFusionWeb helps you share audio, discover public
                    tracks, and keep music ready to play. Start with the part
                    you need—you do not have to follow every section in order.
                </p>
                <p className="text-muted-foreground">
                    Actions that change your library, such as uploading and
                    saving favorites, require you to sign in.
                </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {journeys.map(
                    ({ title, icon: Icon, steps, tip, action }, index) => (
                        <section
                            key={title}
                            className="rounded-2xl border border-accent/60 bg-muted p-5 shadow-inner sm:p-6"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-success/50 bg-success/10 text-success">
                                    <Icon aria-hidden="true" className="size-5" />
                                </span>
                                <div>
                                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Guide {index + 1}
                                    </p>
                                    <h2 className="text-xl font-semibold text-primary">
                                        {title}
                                    </h2>
                                </div>
                            </div>

                            <ol className="space-y-3">
                                {steps.map((step, stepIndex) => (
                                    <li
                                        key={step}
                                        className="flex gap-3 text-sm leading-5 text-foreground"
                                    >
                                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-success">
                                            {stepIndex + 1}
                                        </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>

                            <p className="mt-4 rounded-lg border border-accent/30 bg-background/40 p-3 text-sm leading-5 text-muted-foreground">
                                <strong className="text-success">Tip:</strong>{' '}
                                {tip}
                            </p>

                            {action && (
                                <Link
                                    href={action.href}
                                    className="mt-4 inline-flex rounded-lg border border-primary/70 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
                                >
                                    {action.label}
                                </Link>
                            )}
                        </section>
                    )
                )}
            </div>

            <section className="mt-10" aria-labelledby="faq-heading">
                <div className="mb-5">
                    <p className="text-xs font-semibold tracking-[0.18em] text-success uppercase">
                        Quick answers
                    </p>
                    <h2
                        id="faq-heading"
                        className="mt-1 text-2xl font-semibold text-primary sm:text-3xl"
                    >
                        Frequently asked questions
                    </h2>
                </div>

                <div className="space-y-3">
                    {faqs.map(({ question, answer }) => (
                        <details
                            key={question}
                            className="faq-item rounded-xl border border-accent/60 bg-muted"
                        >
                            <summary className="flex min-h-12 items-center justify-between gap-4 px-4 py-3 font-semibold text-foreground marker:content-none sm:px-5">
                                <span>{question}</span>
                                <span
                                    aria-hidden="true"
                                    className="faq-marker text-xl text-primary"
                                >
                                    +
                                </span>
                            </summary>
                            <p className="border-t border-accent/30 px-4 py-4 text-sm leading-6 text-muted-foreground sm:px-5">
                                {answer}
                            </p>
                        </details>
                    ))}
                </div>
            </section>
        </StaticPageShell>
    )
}
