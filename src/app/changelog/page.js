import {
    APP_VERSION,
    formatReleaseDate,
    formatReleaseVersion,
    RELEASES,
} from '../data/releases'
import ReleaseNotesList from '../components/Releases/ReleaseNotesList'
import ReleaseViewMarker from '../components/Releases/ReleaseViewMarker'
import { StaticPageShell } from '../components/StaticPage'

export const metadata = {
    title: 'Changelog',
    description:
        'See the latest user-facing changes and release history for TrackFusionWeb.',
}

export default function ChangelogPage() {
    return (
        <StaticPageShell title="TrackFusionWeb Changelog">
            <ReleaseViewMarker />

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

                                    <h2 className="text-xl font-semibold text-primary sm:text-2xl">
                                        {release.title}
                                    </h2>
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
                This is the first verified TrackFusionWeb release baseline.
                Earlier versions are not listed because reliable public release
                records are not available.
            </p>
        </StaticPageShell>
    )
}
