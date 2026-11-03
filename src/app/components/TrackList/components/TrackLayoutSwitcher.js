import { Grid2X2, List, PanelsTopLeft } from 'lucide-react'

import { TRACK_LAYOUTS } from '../constants'

const LAYOUT_OPTIONS = [
    { id: TRACK_LAYOUTS.ROWS, label: 'Rows', icon: List },
    { id: TRACK_LAYOUTS.TILES, label: 'Tiles', icon: Grid2X2 },
    { id: TRACK_LAYOUTS.SPOTLIGHT, label: 'Spotlight', icon: PanelsTopLeft },
]

export default function TrackLayoutSwitcher({ layout, onChange }) {
    return (
        <div
            role="group"
            aria-label="Track layout"
            className="flex shrink-0 rounded-lg border border-accent/60 bg-muted/40 p-0.5"
        >
            {LAYOUT_OPTIONS.map(({ id, label, icon: Icon }) => {
                const isSelected = layout === id

                return (
                    <button
                        key={id}
                        type="button"
                        aria-label={`Use ${label} layout`}
                        aria-pressed={isSelected}
                        onClick={() => onChange(id)}
                        className={`flex min-h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                            isSelected
                                ? 'bg-success text-success-foreground'
                                : 'text-foreground hover:bg-secondary-hover hover:text-primary'
                        }`}
                    >
                        <Icon aria-hidden="true" className="size-3.5" />
                        <span className="track-layout-label">{label}</span>
                    </button>
                )
            })}
        </div>
    )
}
