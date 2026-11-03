export default function TrackListEmptyState({
    message = 'No tracks found',
    className = '',
}) {
    return (
        <div
            className={`flex min-h-40 items-center justify-center rounded-xl border border-dashed border-accent/50 px-4 text-center text-muted-foreground ${className}`}
        >
            {message}
        </div>
    )
}
