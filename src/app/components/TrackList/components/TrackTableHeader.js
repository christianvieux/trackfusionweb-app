import { Table } from '@heroui/react'

export default function TrackTableHeader({
    columns,
    className = '',
    ...props
}) {
    return (
        <Table.Header className={`bg-transparent pb-3 ${className}`} {...props}>
            {columns.map(({ key, label, className: columnClass = '' }) => (
                <Table.Column
                    key={key}
                    isRowHeader={key === 'name'}
                    className={`border-0 bg-transparent px-3 py-2 text-xs font-bold text-foreground after:hidden ${columnClass}`}
                >
                    {label}
                </Table.Column>
            ))}
        </Table.Header>
    )
}
