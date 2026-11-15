'use client'

import { useEffect, useState } from 'react'
import { Slider } from '@heroui/react'

import { formatDuration } from '../../utils/audio'

export default function ProgressSlider({
    progress,
    duration,
    onSeek,
    className = '',
}) {
    const [previewProgress, setPreviewProgress] = useState(progress)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        if (!isDragging) setPreviewProgress(progress)
    }, [isDragging, progress])

    function toProgress(value) {
        return duration > 0 ? value / duration : 0
    }

    function handleChange(value) {
        setIsDragging(true)
        setPreviewProgress(toProgress(value))
    }

    function handleChangeEnd(value) {
        const nextProgress = toProgress(value)
        setPreviewProgress(nextProgress)
        setIsDragging(false)
        onSeek(nextProgress)
    }

    return (
        <div className={className}>
            <span>{formatDuration(previewProgress * duration)}</span>
            <Slider
                aria-label="Track progress"
                value={previewProgress * duration}
                minValue={0}
                maxValue={duration || 1}
                step={0.1}
                formatOptions={{
                    style: 'unit',
                    unit: 'second',
                    unitDisplay: 'long',
                }}
                onChange={handleChange}
                onChangeEnd={handleChangeEnd}
                isDisabled={!duration}
                data-scrubbing={isDragging || undefined}
                className="stage-progress-slider min-w-0"
            >
                <Slider.Track className="stage-slider-track stage-progress-slider-track">
                    <Slider.Fill className="stage-slider-fill stage-progress-slider-fill" />
                    <Slider.Thumb className="stage-slider-thumb stage-progress-slider-thumb" />
                </Slider.Track>
            </Slider>
            <span>{formatDuration(duration)}</span>
        </div>
    )
}
