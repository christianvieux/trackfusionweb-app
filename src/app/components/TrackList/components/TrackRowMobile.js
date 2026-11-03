import TrackRowDesktop from './TrackRowDesktop'

// Kept as a compatibility wrapper for older imports. Container queries now
// adapt the same row component instead of maintaining two divergent tables.
export default function TrackRowMobile(props) {
    return <TrackRowDesktop page={1} {...props} />
}
