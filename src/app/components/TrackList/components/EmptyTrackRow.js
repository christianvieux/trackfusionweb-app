import { Table } from '@heroui/react'

export default function EmptyTrackRow({
    colSpan,
    message = 'No tracks found',
}) {
    return (
        <Table.Row key="empty">
            <Table.Cell
                colSpan={colSpan}
                className="border-0 bg-transparent py-5 text-center text-muted-foreground hover:bg-transparent"
            >
                {message}
            </Table.Cell>
        </Table.Row>
    )
}
