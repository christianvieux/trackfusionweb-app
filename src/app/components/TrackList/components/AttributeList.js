import AttributeChip from './AttributeChip'
import { getSortedAttributes } from '../utils'

export default function AttributeList({ attributes = '', className = '' }) {
    const items = getSortedAttributes(attributes)

    if (!items.length) return null

    return (
        <div className={`flex flex-wrap gap-1.5 ${className}`}>
            {items.map((attribute) => (
                <AttributeChip key={attribute} attribute={attribute} />
            ))}
        </div>
    )
}
