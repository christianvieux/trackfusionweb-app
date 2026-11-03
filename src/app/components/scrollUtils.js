const MAX_SCROLL_PER_FRAME = 22
const MAX_DISTANCE_MULTIPLIER = 2.5

function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value))
}

export function getEdgeScrollVelocity({
    pointer,
    start,
    end,
    edgeSize,
    maxSpeed = MAX_SCROLL_PER_FRAME,
}) {
    if (pointer < start + edgeSize) {
        const strength = clamp(
            (start + edgeSize - pointer) / edgeSize,
            0,
            MAX_DISTANCE_MULTIPLIER
        )
        return -maxSpeed * strength
    }

    if (pointer > end - edgeSize) {
        const strength = clamp(
            (pointer - (end - edgeSize)) / edgeSize,
            0,
            MAX_DISTANCE_MULTIPLIER
        )
        return maxSpeed * strength
    }

    return 0
}

export function getEdgeSize(length, minimum = 32, maximum = 88) {
    return clamp(length * 0.18, minimum, maximum)
}
