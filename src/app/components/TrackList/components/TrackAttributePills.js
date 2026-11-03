import { parseAttributes } from '../utils'

const ATTRIBUTE_TYPES = ['category', 'genre', 'mood']

export default function TrackAttributePills({
    track = {},
    onFilter,
    className = '',
    preserveSpace = false,
}) {
    const attributes = ATTRIBUTE_TYPES.map((type) => ({
        type,
        value: parseAttributes(track[type])[0],
    })).filter(({ value }) => Boolean(value))

    if (attributes.length === 0 && !preserveSpace) return null

    return (
        <div className={className}>
            {attributes.map(({ type, value }) => (
                <button
                    key={`${type}-${value}`}
                    type="button"
                    aria-label={`Filter by ${type}: ${value}`}
                    onClick={() => onFilter?.(type, value)}
                    className={`track-attribute-pill track-attribute-pill--${type}`}
                >
                    {value}
                </button>
            ))}
        </div>
    )
}
