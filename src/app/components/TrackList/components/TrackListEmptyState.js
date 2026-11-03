import { RotateCcw, X } from 'lucide-react'

export default function TrackListEmptyState({
    message = 'No tracks found',
    query = '',
    hasActiveFilters = false,
    onClearSearch,
    onClearFilters,
    className = '',
}) {
    const stateMessage = query
        ? `No tracks match “${query}”.`
        : hasActiveFilters
          ? 'No tracks match the selected filters.'
          : message

    return (
        <div
            className={`flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-accent/50 px-4 text-center text-muted-foreground ${className}`}
        >
            <p>{stateMessage}</p>

            {(query || hasActiveFilters) && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {query && (
                        <button
                            type="button"
                            onClick={onClearSearch}
                            className="track-empty-action"
                        >
                            <X aria-hidden="true" className="size-4" />
                            Clear search
                        </button>
                    )}

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onClearFilters}
                            className="track-empty-action"
                        >
                            <RotateCcw aria-hidden="true" className="size-4" />
                            Clear filters
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
