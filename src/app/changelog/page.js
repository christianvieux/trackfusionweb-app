import {
    APP_VERSION,
    formatReleaseDate,
    formatReleaseVersion,
    RELEASES,
} from '../data/releases'
import ReleaseNotesList from '../components/Releases/ReleaseNotesList'
import ReleaseViewMarker from '../components/Releases/ReleaseViewMarker'
import { StaticPageShell } from '../components/StaticPage'
import { DEVELOPMENT_HISTORY } from '../data/developmentHistory'

export const metadata = {
    title: 'Changelog',
    description:
        'See the latest user-facing changes and release history for TrackFusionWeb.',
}

export default function ChangelogPage() {
    return (
        <StaticPageShell title="TrackFusionWeb Changelog">
            <ReleaseViewMarker />

            <section aria-labelledby="whats-new-heading">
                <h2
                    id="whats-new-heading"
                    className="mb-3 text-2xl font-semibold text-primary sm:text-3xl"
                >
                    What&apos;s New
                </h2>

                <p className="mb-8 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                    A simple record of what you can do in each TrackFusionWeb
                    release. The newest release appears first.
                </p>

                <div className="space-y-6">
                    {RELEASES.map((release) => {
                        const isCurrent = release.version === APP_VERSION

                        return (
                            <article
                                key={release.version}
                                className={`rounded-2xl border p-5 shadow-inner sm:p-6 ${
                                    isCurrent
                                        ? 'border-success/70 bg-success/5'
                                        : 'border-accent/50 bg-muted'
                                }`}
                            >
                                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <span className="font-mono text-sm font-semibold text-success">
                                                {formatReleaseVersion(
                                                    release.version
                                                )}
                                            </span>
                                            {isCurrent && (
                                                <span className="rounded-full border border-success/50 bg-success/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-success uppercase">
                                                    Current release
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-semibold text-primary sm:text-2xl">
                                            {release.title}
                                        </h3>
                                    </div>

                                    <time
                                        dateTime={release.date}
                                        className="text-sm text-muted-foreground"
                                    >
                                        {formatReleaseDate(release.date)}
                                    </time>
                                </div>

                                <ReleaseNotesList notes={release.notes} />
                            </article>
                        )
                    })}
                </div>

                <p className="mt-8 text-sm leading-6 text-muted-foreground">
                    v1.0.0 is the first verified TrackFusionWeb release
                    baseline. Earlier versions are not listed because reliable
                    public release records are not available.
                </p>
            </section>

            <section
                aria-labelledby="development-history-heading"
                className="mt-14 border-t border-accent/50 pt-12 sm:mt-16 sm:pt-14"
            >
                <div className="mb-10 max-w-3xl">
                    <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-success uppercase">
                        From the Git history
                    </p>

                    <h2
                        id="development-history-heading"
                        className="mb-4 text-2xl font-semibold text-primary sm:text-3xl"
                    >
                        Development History
                    </h2>

                    <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                        A curated history of the App and API from the first
                        commits through the final frontend polish. Development
                        dates come from Git and do not imply a launch or
                        deployment. Only milestones marked{' '}
                        <span className="font-semibold text-success">
                            Public release
                        </span>{' '}
                        are verified releases.
                    </p>
                </div>

                <div className="space-y-12 sm:space-y-14">
                    {DEVELOPMENT_HISTORY.map((group) => (
                        <section
                            key={group.period}
                            aria-labelledby={`history-${group.period
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')}`}
                            className="grid gap-5 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8"
                        >
                            <h3
                                id={`history-${group.period
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, '-')}`}
                                className="text-lg font-semibold text-primary md:pt-1"
                            >
                                {group.period}
                            </h3>

                            <ol className="relative space-y-6 border-l border-accent/60 pl-5 sm:pl-8">
                                {group.milestones.map((milestone) => {
                                    const isRelease =
                                        milestone.kind === 'release'

                                    return (
                                        <li
                                            key={`${milestone.date}-${milestone.title}`}
                                            className="relative"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`absolute top-2 -left-[1.55rem] h-3 w-3 rounded-full border-2 sm:-left-[2.3rem] ${
                                                    isRelease
                                                        ? 'border-success bg-success'
                                                        : 'border-accent bg-background'
                                                }`}
                                            />

                                            <article className="rounded-2xl border border-accent/40 bg-muted/60 p-5 shadow-inner sm:p-6">
                                                <div className="mb-3 flex flex-wrap items-center gap-2.5">
                                                    <time
                                                        dateTime={
                                                            milestone.date
                                                        }
                                                        className="text-xs font-medium text-muted-foreground sm:text-sm"
                                                    >
                                                        {milestone.dateLabel}
                                                    </time>

                                                    <span
                                                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase sm:text-[11px] ${
                                                            isRelease
                                                                ? 'border-success/50 bg-success/10 text-success'
                                                                : 'border-accent/60 bg-background/60 text-primary'
                                                        }`}
                                                    >
                                                        {isRelease
                                                            ? 'Public release'
                                                            : 'Development'}
                                                    </span>
                                                </div>

                                                <h4 className="mb-2 text-lg font-semibold text-primary sm:text-xl">
                                                    {milestone.title}
                                                </h4>

                                                <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                                                    {milestone.description}
                                                </p>

                                                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                                    {milestone.sources.map(
                                                        (source) => (
                                                            <a
                                                                key={
                                                                    source.href
                                                                }
                                                                href={
                                                                    source.href
                                                                }
                                                                className="font-medium text-success underline decoration-success/40 underline-offset-4 transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-success motion-reduce:transition-none"
                                                            >
                                                                {source.label}
                                                            </a>
                                                        )
                                                    )}
                                                </div>
                                            </article>
                                        </li>
                                    )
                                })}
                            </ol>
                        </section>
                    ))}
                </div>
            </section>
        </StaticPageShell>
    )
}
