import { Chip } from '@heroui/react'
import { getColorForAttribute } from '../../../../config/Colors'

const TAG_CLASSES = {
    'tag-a': 'bg-tag-a-bg text-tag-a border-tag-a-border',
    'tag-b': 'bg-tag-b-bg text-tag-b border-tag-b-border',
    'tag-c': 'bg-tag-c-bg text-tag-c border-tag-c-border',
    'tag-d': 'bg-tag-d-bg text-tag-d border-tag-d-border',
    'tag-e': 'bg-tag-e-bg text-tag-e border-tag-e-border',
    'tag-f': 'bg-tag-f-bg text-tag-f border-tag-f-border',
    'tag-g': 'bg-tag-g-bg text-tag-g border-tag-g-border',
    'tag-h': 'bg-tag-h-bg text-tag-h border-tag-h-border',
}

export default function AttributeChip({
    attribute,
    variant = 'secondary',
    className = '',
    ...props
}) {
    if (!attribute) return null

    const colorKey = getColorForAttribute(attribute) || 'tag-a'
    const tagClass = TAG_CLASSES[colorKey] || TAG_CLASSES['tag-a']

    return (
        <Chip
            variant={variant}
            className={`flex w-max items-center gap-1 border-2 text-xs ${tagClass} ${className}`}
            {...props}
        >
            <span className="h-2 w-2 rounded-full bg-current" />
            {attribute}
        </Chip>
    )
}
