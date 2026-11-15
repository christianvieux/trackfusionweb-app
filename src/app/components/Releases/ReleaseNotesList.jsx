import Link from 'next/link'

const NOTE_GROUPS = [
    { type: 'new', label: 'New' },
    { type: 'improved', label: 'Improved' },
    { type: 'fixed', label: 'Fixed' },
]

export function formatReleaseArea(area) {
    if (area === 'site') return 'Whole site'
    if (area === 'api') return 'API'
    return area
}

export function groupReleaseNotes(notes) {
    return NOTE_GROUPS.map((group) => ({
        ...group,
        notes: notes.filter((note) => note.type === group.type),
    })).filter((group) => group.notes.length > 0)
}

export function ReleaseAreaLabel({ area }) {
    const isApi = area === 'api'

    return (
        <span className={`release-area ${isApi ? 'release-area--api' : ''}`}>
            <span className="release-area-dot" aria-hidden="true" />
            <span>
                {formatReleaseArea(area)}
                {isApi && <small>for developers</small>}
            </span>
        </span>
    )
}

export default function ReleaseNotesList({ notes, compact = false }) {
    return (
        <div
            className={`release-change-list ${compact ? 'release-change-list--compact' : ''}`}
        >
            {groupReleaseNotes(notes).map((group) => (
                <section
                    key={group.type}
                    className={`release-change-group release-change-group--${group.type}`}
                >
                    <h4 className="release-change-heading">
                        <span>{group.label}</span>
                    </h4>

                    <ul>
                        {group.notes.map((note) => (
                            <li
                                key={`${note.area}-${note.text}`}
                                className="release-change-row"
                            >
                                <ReleaseAreaLabel area={note.area} />

                                <div className="release-change-copy">
                                    <p>{note.text}</p>

                                    {note.link && (
                                        <Link
                                            href={note.link.href}
                                            className="release-note-link"
                                        >
                                            {note.link.label}
                                            <span aria-hidden="true"> →</span>
                                        </Link>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    )
}
