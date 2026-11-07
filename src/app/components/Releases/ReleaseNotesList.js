import Link from 'next/link'

const NOTE_LABELS = {
    added: 'Added',
    improved: 'Improved',
    fixed: 'Fixed',
}

export default function ReleaseNotesList({ notes, compact = false }) {
    return (
        <ul className={compact ? 'space-y-3' : 'space-y-4'}>
            {notes.map((note) => (
                <li
                    key={`${note.type}-${note.text}`}
                    className="release-note-item"
                >
                    <span
                        className={`release-note-tag release-note-tag--${note.type}`}
                    >
                        {NOTE_LABELS[note.type]}
                    </span>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm leading-5 text-foreground">
                            {note.text}
                        </p>

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
    )
}
