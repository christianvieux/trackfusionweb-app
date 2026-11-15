import ReleaseAccordion from '../components/Releases/ReleaseAccordion'
import { ReleaseAreaLabel } from '../components/Releases/ReleaseNotesList'
import ReleaseViewMarker from '../components/Releases/ReleaseViewMarker'
import { DEVELOPMENT_HISTORY } from '../data/developmentHistory'
import { formatReleaseDate, RELEASES } from '../data/releases'

export const metadata = {
    title: 'Updates',
    description:
        'See verified TrackFusionWeb releases and the development history behind them.',
}

function getGroupId(period) {
    return `history-${period.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

export default function ChangelogPage() {
    return (
        <main className="updates-page">
            <ReleaseViewMarker />

            <header className="updates-header">
                <p className="updates-eyebrow">TrackFusionWeb</p>
                <h1>Updates</h1>

                <nav
                    aria-label="Updates sections"
                    className="updates-section-nav"
                >
                    <a href="#whats-new">What&apos;s new</a>
                    <a href="#behind-the-scenes">Behind the scenes</a>
                </nav>
            </header>

            <section
                id="whats-new"
                aria-labelledby="whats-new-heading"
                className="updates-section"
            >
                <h2 id="whats-new-heading">What&apos;s new</h2>
                <p className="updates-lead">
                    A simple record of what changed in each version. The next
                    version stays marked Unreleased until it is live.
                </p>

                <div className="updates-ruler updates-release-ruler">
                    <ReleaseAccordion releases={RELEASES} name="release-page" />
                </div>

                <p className="updates-baseline-note">
                    v1.0.0 is the first verified versioned release baseline. The
                    website was available before that date, but earlier version
                    records could not be verified.
                </p>
            </section>

            <section
                id="behind-the-scenes"
                aria-labelledby="behind-the-scenes-heading"
                className="updates-section updates-history"
            >
                <h2 id="behind-the-scenes-heading">Behind the scenes</h2>
                <p className="updates-lead">
                    Improvements made during development. Only entries marked{' '}
                    <strong>Public release</strong> represent a verified
                    versioned release.
                </p>

                <div className="updates-history-groups">
                    {DEVELOPMENT_HISTORY.map((group) => {
                        const groupId = getGroupId(group.period)

                        return (
                            <section
                                key={group.period}
                                aria-labelledby={groupId}
                            >
                                <h3 id={groupId} className="updates-month">
                                    {group.period}
                                </h3>

                                <ol className="updates-ruler updates-history-list">
                                    {group.milestones.map((milestone) => {
                                        const isRelease =
                                            milestone.kind === 'release'

                                        return (
                                            <li
                                                key={`${milestone.date}-${milestone.title}`}
                                                className="updates-history-item"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`updates-history-cue ${isRelease ? 'updates-history-cue--release' : ''}`}
                                                />

                                                <article>
                                                    <div className="updates-history-meta">
                                                        <time
                                                            dateTime={
                                                                milestone.date
                                                            }
                                                        >
                                                            {formatReleaseDate(
                                                                milestone.date
                                                            )}
                                                        </time>

                                                        <span
                                                            className={`updates-history-kind ${isRelease ? 'updates-history-kind--release' : ''}`}
                                                        >
                                                            {isRelease
                                                                ? 'Public release'
                                                                : 'Behind the scenes'}
                                                        </span>

                                                        {milestone.includedIn && (
                                                            <a
                                                                href={`#release-${milestone.includedIn.replaceAll('.', '-')}`}
                                                                className="updates-version-link"
                                                            >
                                                                In v
                                                                {
                                                                    milestone.includedIn
                                                                }{' '}
                                                                <span aria-hidden="true">
                                                                    →
                                                                </span>
                                                            </a>
                                                        )}
                                                    </div>

                                                    <h4>{milestone.title}</h4>
                                                    <p className="updates-history-description">
                                                        {milestone.description}
                                                    </p>

                                                    <div
                                                        className="updates-history-areas"
                                                        aria-label="Affected areas"
                                                    >
                                                        {milestone.areas.map(
                                                            (area) => (
                                                                <ReleaseAreaLabel
                                                                    key={area}
                                                                    area={area}
                                                                />
                                                            )
                                                        )}
                                                    </div>

                                                    <details className="updates-technical-details">
                                                        <summary>
                                                            <span>
                                                                Technical
                                                                details and
                                                                sources
                                                            </span>
                                                            <span
                                                                className="release-disclosure-chevron"
                                                                aria-hidden="true"
                                                            />
                                                        </summary>

                                                        <div className="updates-technical-body">
                                                            <p>
                                                                {
                                                                    milestone.technical
                                                                }
                                                            </p>

                                                            <div className="updates-source-links">
                                                                {milestone.sources.map(
                                                                    (
                                                                        source
                                                                    ) => (
                                                                        <a
                                                                            key={
                                                                                source.href
                                                                            }
                                                                            href={
                                                                                source.href
                                                                            }
                                                                        >
                                                                            {
                                                                                source.label
                                                                            }
                                                                            <span aria-hidden="true">
                                                                                {' '}
                                                                                →
                                                                            </span>
                                                                        </a>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </details>
                                                </article>
                                            </li>
                                        )
                                    })}
                                </ol>
                            </section>
                        )
                    })}
                </div>
            </section>
        </main>
    )
}
