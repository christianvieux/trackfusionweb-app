'use client'

import { useState } from 'react'
import { Button, Slider } from '@heroui/react'
import { Volume2, Volume1, VolumeX } from 'lucide-react'

export default function VolumeSlider({
    className = '',
    onChange,
    defaultValue = 0.8,
    isDisabled = false,
    ...props
}) {
    const [volume, setVolume] = useState(defaultValue)
    const [previousVolume, setPreviousVolume] = useState(defaultValue)

    const isMuted = volume === 0

    function updateVolume(value) {
        setVolume(value)

        if (value > 0) {
            setPreviousVolume(value)
        }

        onChange?.(value)
    }

    function toggleMute() {
        updateVolume(isMuted ? previousVolume || defaultValue : 0)
    }

    function getVolumeIcon() {
        const Icon = isMuted ? VolumeX : volume < 0.5 ? Volume1 : Volume2

        return <Icon className="m-0 size-full" />
    }

    return (
        <div
            className={`flex items-center gap-2 text-muted-foreground ${
                isDisabled ? 'opacity-50' : ''
            } ${className}`}
        >
            <Button
                isIconOnly
                variant="light"
                aria-label={isMuted ? 'Unmute volume' : 'Mute volume'}
                onPress={toggleMute}
                isDisabled={isDisabled}
                className="size-10 min-w-10 bg-transparent p-2 text-muted-foreground hover:bg-success/10 hover:text-success focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                {getVolumeIcon()}
            </Button>

            <Slider
                aria-label="Volume"
                value={volume}
                minValue={0}
                maxValue={1}
                step={0.01}
                onChange={updateVolume}
                isDisabled={isDisabled}
                className="stage-volume-slider flex min-w-0 flex-1 items-center justify-center"
                {...props}
            >
                <Slider.Track className="stage-slider-track stage-volume-slider-track">
                    <Slider.Fill className="stage-slider-fill stage-volume-slider-fill" />
                    <Slider.Thumb className="stage-slider-thumb stage-volume-slider-thumb" />
                </Slider.Track>
            </Slider>
        </div>
    )
}
