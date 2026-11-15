import {
    APP_VERSION,
    formatReleaseDate,
    formatReleaseVersion,
} from '../../data/releases'
import ReleaseEqualizer from './ReleaseEqualizer'
import ReleaseNotesList from './ReleaseNotesList'

function getReleaseId(version, idPrefix) {
    return `${idPrefix}-${version.replaceAll('.', '-')}`
}

export default function ReleaseAccordion({
    releases,
    name,
    variant = 'page',
    idPrefix = 'release',
}) {
    const compact = variant === 'popover'

    return (
        <div className={`release-accordion release-accordion--${variant}`}>
            {releases.map((release) => {
                const isCurrent = release.version === APP_VERSION
                const isUnreleased = release.status === 'unreleased'

                return (
                    <details
                        key={release.version}
                        id={getReleaseId(release.version, idPrefix)}
                        name={name}
                        open={isCurrent}
                        className={`release-entry ${isCurrent ? 'release-entry--current' : ''}`}
                    >
                        <summary className="release-entry-summary">
                            <span
                                className={`release-ruler-cue ${isCurrent ? 'release-ruler-cue--current' : ''}`}
                                aria-hidden="true"
                            />

                            <span className="release-summary-marker">
                                {isCurrent ? (
                                    <ReleaseEqualizer />
                                ) : (
                                    <span
                                        className="release-summary-dot"
                                        aria-hidden="true"
                                    />
                                )}
                            </span>

                            <span className="release-summary-copy">
                                <span className="release-summary-meta">
                                    <span className="release-version">
                                        {formatReleaseVersion(release.version)}
                                    </span>
                                    {isUnreleased ? (
                                        <span>Unreleased</span>
                                    ) : (
                                        <time dateTime={release.date}>
                                            {formatReleaseDate(release.date)}
                                        </time>
                                    )}
                                </span>

                                <span className="release-summary-title">
                                    {release.title}
                                </span>

                                <span className="release-summary-preview">
                                    {release.summary}
                                </span>
                            </span>

                            {isCurrent && (
                                <span className="release-current-label">
                                    {!compact && <ReleaseEqualizer />}
                                    {isUnreleased ? 'Next' : 'Current'}
                                </span>
                            )}

                            <span
                                className="release-disclosure-chevron"
                                aria-hidden="true"
                            />
                        </summary>

                        <div className="release-entry-body">
                            <ReleaseNotesList
                                notes={release.notes}
                                compact={compact}
                            />
                        </div>
                    </details>
                )
            })}
        </div>
    )
}
