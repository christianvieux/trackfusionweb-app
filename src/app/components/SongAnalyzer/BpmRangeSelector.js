import React from 'react'
import { Button } from '@heroui/react'

import { BPM_RANGES } from './utils'

export default function BpmRangeSelector({
    bpmRange,
    setBpmRange,
    isDisabled,
}) {
    return (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">
                Select BPM range
            </h2>

            <div className="analyzer-bpm-options">
                {BPM_RANGES.map((range) => {
                    const isSelected = bpmRange === range.value

                    return (
                        <Button
                            key={range.value}
                            type="button"
                            variant="outline"
                            isDisabled={isDisabled}
                            aria-pressed={isSelected}
                            onPress={() => setBpmRange(range.value)}
                            className={`w-full min-w-0 border-accent px-2 transition ${
                                isSelected
                                    ? 'bg-primary text-background shadow-card'
                                    : 'bg-transparent text-primary hover:bg-secondary-hover'
                            }`}
                        >
                            {range.label}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
