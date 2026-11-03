'use client'

import { forwardRef, useId } from 'react'

const BUTTON_SIZES = {
    sm: 32,
    md: 42,
    lg: 60,
}

function clampProgress(progress) {
    if (!Number.isFinite(progress)) return 0
    return Math.min(1, Math.max(0, progress))
}

const PlayButton = forwardRef(function PlayButton(
    {
        playing = false,
        progress = 0,
        size = 'md',
        onClick,
        label = 'track',
        className = '',
        disabled = false,
        style,
        ...props
    },
    ref
) {
    const buttonSize = BUTTON_SIZES[size] || BUTTON_SIZES.md
    const roughEdgeFilterId = `play-button-edge-${useId().replaceAll(':', '')}`

    return (
        <button
            ref={ref}
            type="button"
            aria-pressed={playing}
            aria-label={`${playing ? 'Pause' : 'Play'} ${label}`}
            onClick={onClick}
            disabled={disabled}
            className={`play-btn ${playing ? 'is-playing' : ''} ${className}`}
            style={{
                '--play-button-size': `${buttonSize}px`,
                '--progress': clampProgress(progress),
                ...style,
            }}
            {...props}
        >
            <span className="play-btn__wob" aria-hidden="true">
                <span className="play-btn__fill" />
                <svg className="play-btn__ring" viewBox="0 0 48 48">
                    {playing && (
                        <defs>
                            <filter
                                id={roughEdgeFilterId}
                                x="-15%"
                                y="-15%"
                                width="130%"
                                height="130%"
                            >
                                <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency="0.035 0.055"
                                    numOctaves="1"
                                    seed="4"
                                    result="edgeNoise"
                                >
                                    <animate
                                        attributeName="baseFrequency"
                                        values="0.035 0.055;0.05 0.04;0.035 0.055"
                                        dur="2.4s"
                                        repeatCount="indefinite"
                                    />
                                </feTurbulence>
                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="edgeNoise"
                                    scale="0.8"
                                    xChannelSelector="R"
                                    yChannelSelector="G"
                                />
                            </filter>
                        </defs>
                    )}
                    <g
                        className="play-btn__rings"
                        filter={
                            playing ? `url(#${roughEdgeFilterId})` : undefined
                        }
                    >
                        <circle
                            className="play-btn__track"
                            cx="24"
                            cy="24"
                            r="21"
                        />
                        <circle
                            className="play-btn__progress"
                            cx="24"
                            cy="24"
                            r="21"
                        />
                    </g>
                </svg>
            </span>

            <svg
                className={`play-btn__glyph ${playing ? 'play-btn__glyph--pause' : 'play-btn__glyph--play'}`}
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                {playing ? (
                    <>
                        <rect x="6" y="4" width="4.5" height="16" rx="2" />
                        <rect x="13.5" y="4" width="4.5" height="16" rx="2" />
                    </>
                ) : (
                    <path
                        d="M7.5 5.75 18.25 12 7.5 18.25Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                )}
            </svg>
        </button>
    )
})

PlayButton.displayName = 'PlayButton'

export default PlayButton
