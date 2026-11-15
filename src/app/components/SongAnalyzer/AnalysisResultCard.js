import React from 'react'

import MusicNoteIcon from '../Icons/MusicNote'
import MetronomeIcon from '../Icons/Metronome'

function ResultItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
            <div className="rounded-full bg-secondary p-2">
                <Icon className="size-8 text-primary" />
            </div>

            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-semibold text-foreground">{value}</p>
            </div>
        </div>
    )
}

export default function AnalysisResultCard({ results }) {
    if (!results) return null

    return (
        <section className="w-full min-w-0 space-y-4 rounded-lg border-2 border-accent bg-secondary p-4 shadow-card sm:p-6 lg:max-w-xs">
            <h2 className="text-lg font-semibold text-primary">
                Analysis results
            </h2>

            <div className="grid grid-cols-1 gap-4">
                <ResultItem
                    icon={MetronomeIcon}
                    label="BPM"
                    value={results.bpm}
                />

                <ResultItem
                    icon={MusicNoteIcon}
                    label="Key"
                    value={results.key}
                />
            </div>

            <p className="rounded-lg bg-muted p-3 text-center text-sm text-foreground">
                More analysis features coming soon.
            </p>
        </section>
    )
}
